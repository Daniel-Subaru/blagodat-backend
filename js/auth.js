// ============================================
// auth.js — обробка реєстрації, логіну, соцмереж
// ============================================

const API_BASE = 'http://localhost:3000/api/auth';

// Перемикання між табами
const tabs = document.querySelectorAll('.auth-tab');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target === 'login') {
            loginPanel.style.display = 'block';
            registerPanel.style.display = 'none';
        } else {
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'block';
        }
    });
});

// Функція показу повідомлень (toast)
function showMessage(text, isError = true) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        alert(text);
    }
}

// Логін
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            showMessage('Вхід успішний!', false);
            setTimeout(() => window.location.href = '/', 1000);
        } else {
            showMessage(data.error || 'Помилка входу');
        }
    } catch (err) {
        showMessage('Помилка з\'єднання з сервером');
    }
});

// Реєстрація
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ firstName, lastName, email, phone, password })
        });
        const data = await res.json();
        if (res.ok) {
            showMessage('Реєстрація успішна! Виконано автоматичний вхід.', false);
            setTimeout(() => window.location.href = '/', 1000);
        } else {
            showMessage(data.error || 'Помилка реєстрації');
        }
    } catch (err) {
        showMessage('Помилка з\'єднання з сервером');
    }
});

// Соціальні кнопки
document.getElementById('googleLogin')?.addEventListener('click', () => {
    window.location.href = `${API_BASE}/google`;
});
document.getElementById('facebookLogin')?.addEventListener('click', () => {
    window.location.href = `${API_BASE}/facebook`;
});

// Тема (якщо потрібно)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// Бургер меню (якщо є)
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
if (burgerBtn && navMenu) {
    const closeMenu = () => {
        navMenu.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
    };

    burgerBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        burgerBtn.classList.toggle('open', isOpen);
        burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('.navbar__link, .dropdown-item').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        const clickedInsideNavbar = burgerBtn.closest('.navbar')?.contains(event.target);
        if (navMenu.classList.contains('open') && !clickedInsideNavbar) {
            closeMenu();
        }
    });
}