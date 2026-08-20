/**
 * MINI SHOP - AUTH SCRIPT (bai.02)
 * Xử lý đăng nhập / đăng ký / phân quyền tài khoản Khách vs Admin
 */

(function () {
  'use strict';

  // Điền tài khoản demo
  window.fillDemoAccount = function (type) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (type === 'customer') {
      if (emailInput) emailInput.value = 'user@minishop.vn';
      if (passwordInput) passwordInput.value = '123456';
    } else if (type === 'admin') {
      if (emailInput) emailInput.value = 'admin@minishop.vn';
      if (passwordInput) passwordInput.value = 'admin123';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // 1. Xử lý Đăng Nhập
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
          showToast('Vui lòng nhập đầy đủ email và mật khẩu!', 'danger');
          return;
        }

        // Kiểm tra tài khoản admin
        if (email === 'admin@minishop.vn' || email.toLowerCase().includes('admin')) {
          const adminUser = {
            id: 2,
            name: 'Quản Trị Viên (Admin)',
            email: email,
            role: 'ADMIN',
            phone: '0999888777'
          };
          ShopData.setCurrentUser(adminUser);
          showToast('Đăng nhập Quản trị viên thành công!');
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 600);
          return;
        }

        // Tài khoản khách thường
        const customerUser = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'CUSTOMER',
          phone: '0912345678'
        };
        ShopData.setCurrentUser(customerUser);
        showToast(`Chào mừng ${customerUser.name} quay trở lại!`);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 600);
      });
    }

    // 2. Xử lý Đăng Ký
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
          showToast('Mật khẩu nhập lại không khớp!', 'danger');
          return;
        }

        const newUser = {
          id: Date.now(),
          name: name,
          email: email,
          phone: phone,
          role: 'CUSTOMER'
        };

        ShopData.addUser(newUser);
        ShopData.setCurrentUser(newUser);

        showToast('Đăng ký tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    }
  });

})();
