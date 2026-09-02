/* =============================================
   БЛАГОДАТЬ КРАМНИЦЯ — script.js (ОПТИМІЗОВАНИЙ)
   Модулі:
   1. Theme Toggle
   2. Navbar scroll shadow
   3. Mobile burger menu
   4. Category filter
   5. Products filter
   6. Scroll Reveal (IntersectionObserver)
   Примітка: логіка швидкого перегляду товару винесена в js/quickview.js
============================================= */

/* =============================================
   1. THEME TOGGLE
============================================= */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* =============================================
   2. NAVBAR SCROLL SHADOW
============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

/* =============================================
   3. MOBILE BURGER MENU
============================================= */
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');

burgerBtn?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burgerBtn.classList.toggle('open', isOpen);
  burgerBtn.setAttribute('aria-expanded', String(isOpen));
});

navMenu?.querySelectorAll('.navbar__link:not(.dropdown-trigger), .dropdown-item').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burgerBtn?.classList.remove('open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  const clickedInsideNavbar = navbar?.contains(e.target);
  if (navMenu?.classList.contains('open') && !clickedInsideNavbar) {
    navMenu.classList.remove('open');
    burgerBtn?.classList.remove('open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
  }
});

/* =============================================
   4. CATEGORY CARDS (scroll + filter)
============================================= */
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const category = card.dataset.category;
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
      filterBtn?.click();
    }, 400);
  });
});

/* =============================================
   5. PRODUCTS FILTER
============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.classList.remove('hidden');
        card.classList.remove('fade-in');
        void card.offsetWidth;
        card.style.animationDelay = `${(i % 12) * 0.05}s`;
        card.classList.add('fade-in');
      } else {
        card.classList.add('hidden');
        card.classList.remove('fade-in');
      }
    });
  });
});

/* =============================================
   6. SCROLL REVEAL
============================================= */
function initScrollReveal() {
  document.querySelector('.section-header')?.classList.add('reveal');
  document.querySelector('.categories__grid')?.classList.add('reveal-stagger');
  document.querySelector('.products__grid')?.classList.add('reveal-stagger');
  document.querySelector('.about__grid')?.classList.add('reveal');
  document.querySelectorAll('.contact__card').forEach(c => c.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

/* =============================================
   INIT
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ========== ВИПАДАЮЧЕ МЕНЮ ДЛЯ МОБІЛЬНИХ ==========
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.navbar__dropdown');
    const trigger = document.querySelector('.dropdown-trigger');
    if (!dropdown || !trigger) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', String(isOpen));
        }
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        });
    });
});
