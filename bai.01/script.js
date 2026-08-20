/**
 * Mini Game: Bắt Điểm 30 Giây
 * 100% Vanilla JavaScript - No External Libraries
 */

(function () {
  'use strict';

  // --- 1. DOM Elements ---
  const arcadeCard = document.getElementById('arcadeCard');
  const timerDisplay = document.getElementById('timerDisplay');
  const hudTimer = document.getElementById('hudTimer');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const livesDisplay = document.getElementById('livesDisplay');
  const gameArena = document.getElementById('gameArena');
  const arenaOverlay = document.getElementById('arenaOverlay');
  const overlayContent = document.getElementById('overlayContent');
  const startBtn = document.getElementById('startBtn');
  const fxCanvas = document.getElementById('fxCanvas');
  
  const gameOverModal = document.getElementById('gameOverModal');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const finalScoreDisplay = document.getElementById('finalScoreDisplay');
  const highScoreDisplay = document.getElementById('highScoreDisplay');
  const modalMessage = document.getElementById('modalMessage');
  const restartBtn = document.getElementById('restartBtn');

  // --- 2. Game Configurations & State ---
  const GAME_DURATION = 30; // 30 seconds
  const INITIAL_LIVES = 3;
  
  let gameState = 'IDLE'; // 'IDLE' | 'PLAYING' | 'GAMEOVER'
  let timeLeft = GAME_DURATION;
  let score = 0;
  let lives = INITIAL_LIVES;
  let highScore = parseInt(localStorage.getItem('bat_diem_high_score') || '0', 10);
  
  let timerInterval = null;
  let spawnerTimeout = null;
  let activeObjects = new Map(); // id -> { el, type, timeoutId }
  let objCounter = 0;

  // --- 3. Web Audio Synthesizer (No external sound files required) ---
  const SoundFX = {
    ctx: null,

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playCatchPoint() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    },

    playBombExplosion() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Bass oscillator drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      // Noise buffer for explosion crunch
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.3);
    },

    playStart() {
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      });
    },

    playGameOver(isVictory) {
      if (!this.ctx) return;
      const notes = isVictory ? [523.25, 659.25, 783.99, 1046.50] : [400, 340, 290, 220];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isVictory ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    }
  };

  // --- 4. Particle FX Engine (Canvas) ---
  const ParticleEngine = {
    ctx: null,
    particles: [],
    animId: null,

    init() {
      this.ctx = fxCanvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.loop();
    },

    resize() {
      const rect = gameArena.getBoundingClientRect();
      fxCanvas.width = rect.width;
      fxCanvas.height = rect.height;
    },

    burst(x, y, colorType) {
      const count = colorType === 'green' ? 18 : 28;
      const colors = colorType === 'green' 
        ? ['#39ff14', '#70ff4f', '#bbf7d0', '#ffffff'] 
        : ['#ef4444', '#f97316', '#fbbf24', '#ffffff', '#1e293b'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 4 + 1.5) * (colorType === 'green' ? 1 : 1.4);
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          gravity: 0.08
        });
      }
    },

    loop() {
      this.animId = requestAnimationFrame(() => this.loop());
      if (this.particles.length === 0) {
        this.ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        return;
      }

      this.ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  };

  // --- 5. SVG Graphics Templates ---
  function getGreenTargetSVG() {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="#70ff4f"/>
            <stop offset="70%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </radialGradient>
        </defs>
        <!-- Các gai phát sáng xung quanh -->
        <g stroke="#70ff4f" stroke-width="4" stroke-linecap="round">
          <line x1="50" y1="12" x2="50" y2="24"/>
          <line x1="50" y1="76" x2="50" y2="88"/>
          <line x1="12" y1="50" x2="24" y2="50"/>
          <line x1="76" y1="50" x2="88" y2="50"/>
          <line x1="23" y1="23" x2="32" y2="32"/>
          <line x1="68" y1="68" x2="77" y2="77"/>
          <line x1="23" y1="77" x2="32" y2="68"/>
          <line x1="68" y1="32" x2="77" y2="23"/>
        </g>
        <!-- Vòng hào quang phát sáng -->
        <circle cx="50" cy="50" r="32" fill="rgba(112, 255, 79, 0.25)" />
        <!-- Quả cầu trung tâm -->
        <circle cx="50" cy="50" r="22" fill="url(#greenGlow)"/>
        <circle cx="43" cy="43" r="5" fill="#ffffff" opacity="0.8"/>
      </svg>
    `;
  }

  function getBombHazardSVG() {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bombShine" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="40%" stop-color="#334155"/>
            <stop offset="90%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <!-- Thân bom -->
        <circle cx="48" cy="56" r="34" fill="url(#bombShine)"/>
        <circle cx="36" cy="44" r="7" fill="#ffffff" opacity="0.45"/>
        <!-- Cổ bom -->
        <rect x="42" y="20" width="12" height="7" rx="2" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
        <!-- Ngòi nổ -->
        <path d="M 48 20 Q 56 12 64 15" stroke="#ca8a04" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Tia lửa nổ -->
        <g class="bomb-spark">
          <polygon points="64,15 67,8 71,14 78,11 74,18 80,24 72,23 68,30 65,22 58,20" fill="#facc15"/>
          <circle cx="69" cy="18" r="4" fill="#ef4444"/>
        </g>
      </svg>
    `;
  }

  // --- 6. Helper: Spawn Text Popups ---
  function showFloatingText(x, y, text, type) {
    const el = document.createElement('div');
    el.className = `float-tag ${type}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    gameArena.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 700);
  }

  // --- 7. Game Object Spawner ---
  function getRandomCoordinates() {
    const arenaRect = gameArena.getBoundingClientRect();
    const margin = 36;
    const minX = margin;
    const maxX = arenaRect.width - margin;
    const minY = margin;
    const maxY = arenaRect.height - margin;

    const x = Math.floor(Math.random() * (maxX - minX)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY)) + minY;
    return { x, y };
  }

  function spawnObject() {
    if (gameState !== 'PLAYING') return;

    // Tỷ lệ xuất hiện: 70% chấm xanh, 30% bom
    const isBomb = Math.random() < 0.28;
    const type = isBomb ? 'bomb' : 'target';

    const { x, y } = getRandomCoordinates();
    const objId = ++objCounter;

    const el = document.createElement('div');
    el.className = 'game-obj';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    if (type === 'target') {
      el.innerHTML = `<div class="target-orb">${getGreenTargetSVG()}</div>`;
    } else {
      el.innerHTML = `<div class="hazard-bomb">${getBombHazardSVG()}</div>`;
    }

    // Thời gian tồn tại của vật thể trên màn hình: 1.5s - 2.4s
    const lifetime = Math.max(1400, 2400 - (GAME_DURATION - timeLeft) * 30);

    const timeoutId = setTimeout(() => {
      despawnObject(objId);
    }, lifetime);

    // Xử lý sự kiện click / tap
    const handleInteract = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onObjectClicked(objId, x, y, type, el);
    };

    el.addEventListener('mousedown', handleInteract);
    el.addEventListener('touchstart', handleInteract, { passive: false });

    gameArena.appendChild(el);
    activeObjects.set(objId, { el, type, timeoutId });

    // Kích hoạt animation xuất hiện
    requestAnimationFrame(() => {
      el.classList.add('active');
    });

    // Lên lịch spawn vật thể tiếp theo (tần suất nhanh dần)
    scheduleNextSpawn();
  }

  function despawnObject(id) {
    if (!activeObjects.has(id)) return;
    const { el, timeoutId } = activeObjects.get(id);
    clearTimeout(timeoutId);

    el.classList.remove('active');
    el.classList.add('despawning');

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeObjects.delete(id);
    }, 250);
  }

  function onObjectClicked(id, x, y, type, el) {
    if (gameState !== 'PLAYING') return;
    if (!activeObjects.has(id)) return;

    const { timeoutId } = activeObjects.get(id);
    clearTimeout(timeoutId);
    activeObjects.delete(id);

    el.classList.add('clicked');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 180);

    if (type === 'target') {
      // Ăn điểm
      score += 1;
      scoreDisplay.textContent = score;
      SoundFX.playCatchPoint();
      ParticleEngine.burst(x, y, 'green');
      showFloatingText(x, y, '+1', 'plus');
    } else {
      // Trúng bom
      lives -= 1;
      livesDisplay.textContent = Math.max(0, lives);
      SoundFX.playBombExplosion();
      ParticleEngine.burst(x, y, 'red');
      showFloatingText(x, y, '-1 ❤️', 'minus');

      // Rung màn hình
      arcadeCard.classList.remove('shake-screen');
      void arcadeCard.offsetWidth; // trigger reflow
      arcadeCard.classList.add('shake-screen');

      if (lives <= 0) {
        endGame('LIVES_OUT');
        return;
      }
    }
  }

  function scheduleNextSpawn() {
    if (gameState !== 'PLAYING') return;

    // Khoảng thời gian giữa các lần sinh: 450ms -> 850ms
    const baseDelay = Math.max(380, 750 - (GAME_DURATION - timeLeft) * 12);
    const jitter = Math.random() * 250;
    const nextDelay = baseDelay + jitter;

    spawnerTimeout = setTimeout(() => {
      spawnObject();
    }, nextDelay);
  }

  function clearAllObjects() {
    activeObjects.forEach(({ el, timeoutId }) => {
      clearTimeout(timeoutId);
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    activeObjects.clear();
  }

  // --- 8. Game Flow & Timers ---
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startGame() {
    SoundFX.init();
    SoundFX.playStart();

    // Reset state
    gameState = 'PLAYING';
    timeLeft = GAME_DURATION;
    score = 0;
    lives = INITIAL_LIVES;

    timerDisplay.textContent = formatTime(timeLeft);
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    hudTimer.classList.remove('warning');

    clearAllObjects();
    arenaOverlay.classList.add('hidden');
    gameOverModal.classList.remove('show');

    startBtn.style.display = 'none';

    // Bắt đầu đếm ngược
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);

      if (timeLeft <= 5) {
        hudTimer.classList.add('warning');
      }

      if (timeLeft <= 0) {
        endGame('TIME_OUT');
      }
    }, 1000);

    // Bắt đầu sinh vật thể đầu tiên
    spawnObject();
    setTimeout(() => spawnObject(), 200);
  }

  function endGame(reason) {
    gameState = 'GAMEOVER';
    clearInterval(timerInterval);
    clearTimeout(spawnerTimeout);
    clearAllObjects();

    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
      highScore = score;
      localStorage.setItem('bat_diem_high_score', highScore.toString());
    }

    finalScoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;

    if (reason === 'TIME_OUT') {
      modalBadge.textContent = '⏰ HẾT GIỜ!';
      modalTitle.textContent = 'HOÀN THÀNH 30 GIÂY';
      modalMessage.textContent = isNewHighScore 
        ? '🎉 XUẤT SẮC! Bạn đã phá vỡ kỷ lục điểm cao mới!' 
        : `Bạn đã bắt được ${score} điểm! Rất nhanh tay!`;
    } else {
      modalBadge.textContent = '💥 HẾT MẠNG!';
      modalTitle.textContent = 'BẠN ĐÃ TRÚNG BOM';
      modalMessage.textContent = 'Đừng nản lòng! Hãy né các quả bom cẩn thận hơn ở lượt sau nhé!';
    }

    SoundFX.playGameOver(reason === 'TIME_OUT' && score > 0);

    setTimeout(() => {
      gameOverModal.classList.add('show');
    }, 300);
  }

  // --- 9. Event Listeners ---
  startBtn.addEventListener('click', () => {
    startGame();
  });

  restartBtn.addEventListener('click', () => {
    gameOverModal.classList.remove('show');
    startGame();
  });

  // --- 10. Initialization ---
  ParticleEngine.init();
  timerDisplay.textContent = formatTime(GAME_DURATION);
  scoreDisplay.textContent = '0';
  livesDisplay.textContent = INITIAL_LIVES;

})();
