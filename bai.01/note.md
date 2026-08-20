# Bài 01: Mini Game Bắt Điểm 30 Giây

## 1. Giới thiệu dự án
Dự án game arcade tương tác **"Bắt Điểm 30 Giây"** được xây dựng bằng công nghệ Web thuần túy (**HTML5, CSS3, JavaScript ES6+**), không sử dụng thư viện bên ngoài.

---

## 2. Cấu trúc thư mục
```text
bai.01/
├── index.html   # Cấu trúc giao diện game & modal kết quả
├── style.css    # Thiết kế giao diện phong cách Cyber/Arcade, hiệu ứng neon & 3D grid
├── script.js    # Logic game (tính điểm, đếm ngược 30s, particle effects, âm thanh Web Audio API)
└── note.md      # Ghi chú tổng hợp dự án Bài 01
```

---

## 3. Các tính năng chính
- **Thời gian chơi**: Đếm ngược 30 giây kịch tính.
- **Hệ thống mục tiêu đa dạng**:
  - 🔵 **Chấm xanh (Target)**: Nhấp trúng được cộng điểm (+1 điểm).
  - 💣 **Quả bom (Hazard)**: Nhấp nhầm bị trừ 1 mạng.
- **Hiệu ứng đồ họa & âm thanh**:
  - Canvas Particle FX (tia lửa khi click, rung màn hình khi trúng bom).
  - Web Audio API synthesizer tạo hiệu ứng âm thanh sống động trực tiếp trên trình duyệt.
- **Lưu điểm cao**: Tự động lưu High Score qua `localStorage`.
- **Responsive**: Tương thích tốt trên cả máy tính và điện thoại cảm ứng.

---

## 4. Bảng kiểm tra & Đối chiếu kết quả (Test Form)

| Dấu hiệu | Đúng là (Yêu cầu) | Kết quả kiểm tra | Chi tiết kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Nút Bắt đầu** | Bấm vào thì game khởi động | ✅ **ĐẠT** | Bấm `#startBtn` gọi `startGame()`, kích hoạt timer, bắt đầu sinh chấm xanh/bom. |
| **Đồng hồ** | Đếm ngược từ 30 về 0 | ✅ **ĐẠT** | Khởi tạo `30s`, mỗi giây đếm lùi `00:30` ➔ `00:00`, chuyển cảnh báo đỏ ở 5s cuối. |
| **Điểm** | Bấm trúng chấm xanh thì tăng | ✅ **ĐẠT** | Bấm trúng orb xanh `score += 1`, cập nhật bảng điểm, nổ tia sáng xanh & âm thanh ăn điểm. |
| **Mạng** | Bấm nhầm quả bom thì giảm một | ✅ **ĐẠT** | Bấm quả bom `lives -= 1`, rung màn hình (shake effect), nổ hạt lửa đỏ & âm thanh bom. |
| **Kết thúc** | Hết giờ hoặc hết mạng thì dừng, hiện điểm cuối | ✅ **ĐẠT** | Khi `timeLeft <= 0` hoặc `lives <= 0`, gọi `endGame()`, dừng bộ đếm và hiện Modal bảng điểm cuối. |

---

## 5. Hướng dẫn chạy
1. Mở file [index.html](file:///d:/tinhocsaoviet.com/training/bai.01/index.html) trực tiếp bằng trình duyệt (Chrome, Edge, Firefox, Safari) hoặc qua Live Server.
2. Bấm nút **"BẮT ĐẦU"** và trải nghiệm.
