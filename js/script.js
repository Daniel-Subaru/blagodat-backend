/* =============================================
   БЛАГОДАТЬ КРАМНИЦЯ — script.js (ОПТИМІЗОВАНИЙ)
   Модулі:
   1. Theme Toggle
   2. Navbar scroll shadow
   3. Mobile burger menu
   4. Category filter
   5. Products filter
   6. Scroll Reveal (IntersectionObserver)
   7. Quick View Modal
============================================= */

/* =============================================
   ДАНІ ТОВАРІВ (для швидкого перегляду)
============================================= */
const productData = {};

function buildProductData() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const price = parseInt(card.dataset.price, 10);
    const name = card.querySelector('.product-card__name')?.textContent?.trim() || 'Товар';
    const emoji = card.querySelector('.product-card__emoji')?.textContent?.trim() || '📦';
    const bg = card.querySelector('.product-card__img')?.style?.background || '#ccc';
    productData[id] = { id, price, name, emoji, bg };
  });
}

/* =============================================
   1. THEME TOGGLE
============================================= */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
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
  burgerBtn.setAttribute('aria-expanded', isOpen);
});

navMenu?.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('open') && !navbar?.contains(e.target)) {
    navMenu.classList.remove('open');
    burgerBtn?.classList.remove('open');
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
   7. QUICK VIEW MODAL + CAROUSEL
============================================= */

function extendProductDataWithDetails() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    if (!id || !productData[id]) return;

    let discountPercent = 0;
    const badge = card.querySelector('.product-card__badge.sale');
    if (badge) {
      const match = badge.textContent.match(/(\d+)/);
      if (match) discountPercent = parseInt(match[1], 10);
    }

    const originalPrice = parseInt(card.dataset.price, 10);
    let finalPrice = originalPrice;
    if (discountPercent > 0) {
      finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    }

    let description = card.getAttribute('data-description');
    if (!description) {
      description = `✨ Чудовий товар з категорії "${card.querySelector('.product-card__cat')?.textContent || ''}".`;
    }

    let images = [];
    for (let i = 1; i <= 5; i++) {
      const imgUrl = card.getAttribute(`data-image-${i}`);
      if (imgUrl) images.push(imgUrl);
    }
    if (images.length === 0) {
      const emoji = card.querySelector('.product-card__emoji')?.textContent || '📦';
      images.push(`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0e4d8'/%3E%3Ctext x='50' y='55' font-size='50' text-anchor='middle' dy='.3em'%3E${emoji}%3C/text%3E%3C/svg%3E`);
    }

    productData[id] = {
      ...productData[id],
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      finalPrice: finalPrice,
      description: description,
      images: images,
      category: card.querySelector('.product-card__cat')?.textContent || '',
      rating: card.querySelector('.product-card__stars')?.textContent?.trim() || '★★★★★'
    };
  });
}

function createModal() {
  if (document.getElementById('quickviewModal')) return;

  const modalHTML = `
    <div class="modal-overlay" id="quickviewOverlay">
      <div class="quickview-modal" id="quickviewModal">
        <button class="modal-close" id="modalCloseBtn">&times;</button>
        <div class="modal-body">
          <div class="modal-carousel">
            <div class="carousel-container">
              <div class="carousel-main" id="carouselMain">
                <img id="carouselImg" src="" alt="Product image">
              </div>
              <button class="carousel-btn carousel-prev" id="carouselPrev">‹</button>
              <button class="carousel-btn carousel-next" id="carouselNext">›</button>
            </div>
            <div class="carousel-dots" id="carouselDots"></div>
          </div>
          <div class="modal-info">
            <span class="modal-category" id="modalCategory"></span>
            <h2 id="modalTitle"></h2>
            <div class="modal-rating" id="modalRating"></div>
            <div class="modal-price" id="modalPrice"></div>
            <div class="modal-description" id="modalDesc"></div>
            <button class="btn btn--primary modal-add-to-cart" id="modalAddToCart">🛒 Додати в кошик</button>
          </div>
        </div>
      </div>
    </div>
    <div class="zoom-overlay" id="zoomOverlay">
      <img id="zoomImg" src="" alt="Zoomed">
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

let currentImages = [];
let currentIndex = 0;

function updateCarousel(index) {
  const imgEl = document.getElementById('carouselImg');
  if (!imgEl || !currentImages.length) return;
  imgEl.src = currentImages[index % currentImages.length];

  const dotsContainer = document.getElementById('carouselDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = currentImages.map((_, i) =>
      `<span class="dot ${i === index ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    dotsContainer.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentIndex = parseInt(e.target.dataset.index, 10);
        updateCarousel(currentIndex);
      });
    });
  }
}

function nextImage() {
  if (currentImages.length) {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateCarousel(currentIndex);
  }
}

function prevImage() {
  if (currentImages.length) {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateCarousel(currentIndex);
  }
}

function formatPriceModal(n) {
  return n.toLocaleString('uk-UA') + ' ₴';
}

function openQuickView(productId) {
  const product = productData[productId];
  if (!product) return;

  currentImages = product.images || [];
  currentIndex = 0;

  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalRating').innerHTML = '★'.repeat(parseInt(product.rating)) + '☆'.repeat(5 - parseInt(product.rating));
  document.getElementById('modalDesc').textContent = product.description;

  const priceContainer = document.getElementById('modalPrice');
  if (product.discountPercent > 0) {
    priceContainer.innerHTML = `
      <span class="old-price">${formatPriceModal(product.originalPrice)}</span>
      <span class="new-price">${formatPriceModal(product.finalPrice)}</span>
      <span style="font-size:0.8rem; color:var(--accent);">(-${product.discountPercent}%)</span>
    `;
  } else {
    priceContainer.innerHTML = `<span class="regular-price">${formatPriceModal(product.originalPrice)}</span>`;
  }

  updateCarousel(0);

  const overlay = document.getElementById('quickviewOverlay');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const addBtn = document.getElementById('modalAddToCart');
  if (addBtn) {
    addBtn.onclick = () => {
      if (typeof addToCart === 'function') {
        addToCart(productId);
      }
      closeQuickView();
    };
  }
}

function closeQuickView() {
  const overlay = document.getElementById('quickviewOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function openZoom(imgSrc) {
  const zoomOverlay = document.getElementById('zoomOverlay');
  const zoomImg = document.getElementById('zoomImg');
  if (zoomOverlay && zoomImg) {
    zoomImg.src = imgSrc;
    zoomOverlay.classList.add('active');
  }
}

function closeZoom() {
  const zoomOverlay = document.getElementById('zoomOverlay');
  if (zoomOverlay) zoomOverlay.classList.remove('active');
}

function initQuickViewButtons() {
  document.querySelectorAll('.product-card__quick').forEach(btn => {
    btn.removeEventListener('click', quickViewHandler);
    btn.addEventListener('click', quickViewHandler);
  });
}

function quickViewHandler(e) {
  e.stopPropagation();
  const card = e.currentTarget.closest('.product-card');
  if (!card) return;
  const id = card.dataset.id;
  if (id && productData[id]) {
    openQuickView(id);
  }
}

function bindModalEvents() {
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeQuickView);
  document.getElementById('quickviewOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('quickviewOverlay')) closeQuickView();
  });
  document.getElementById('carouselPrev')?.addEventListener('click', prevImage);
  document.getElementById('carouselNext')?.addEventListener('click', nextImage);
  document.getElementById('zoomOverlay')?.addEventListener('click', closeZoom);
  document.getElementById('carouselImg')?.addEventListener('click', () => {
    const img = document.getElementById('carouselImg');
    if (img && img.src) openZoom(img.src);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeZoom();
    }
    if (e.key === 'ArrowLeft' && document.getElementById('quickviewOverlay')?.classList.contains('active')) {
      prevImage();
    }
    if (e.key === 'ArrowRight' && document.getElementById('quickviewOverlay')?.classList.contains('active')) {
      nextImage();
    }
  });
}

function updateCardPricesWithDiscount() {
  document.querySelectorAll('.product-card').forEach(card => {
    const priceSpan = card.querySelector('.product-card__price');
    if (!priceSpan) return;
    const badge = card.querySelector('.product-card__badge.sale');
    if (badge) {
      const match = badge.textContent.match(/(\d+)/);
      if (match) {
        const discount = parseInt(match[1], 10);
        const original = parseInt(card.dataset.price, 10);
        const salePrice = Math.round(original * (1 - discount / 100));
        priceSpan.innerHTML = `<span style="text-decoration:line-through; font-size:0.8rem; margin-right:6px;">${original} ₴</span> <span style="color:#e05555; font-weight:800;">${salePrice} ₴</span>`;
        card.dataset.price = salePrice;
      }
    }
  });
}

/* =============================================
   INIT
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  buildProductData();
  initScrollReveal();

  setTimeout(() => {
    extendProductDataWithDetails();
    createModal();
    bindModalEvents();
    initQuickViewButtons();
    updateCardPricesWithDiscount();
  }, 100);
});

const observerForQuick = new MutationObserver(() => {
  initQuickViewButtons();
});
observerForQuick.observe(document.body, { childList: true, subtree: true });

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// ========== ВИПАДАЮЧЕ МЕНЮ ДЛЯ МОБІЛЬНИХ ==========
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.navbar__dropdown');
    const trigger = document.querySelector('.dropdown-trigger');
    if (!dropdown || !trigger) return;

    // Для мобільних: клік відкриває/закриває меню
    trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('open');
        }
    });

    // Закриваємо меню при кліку поза ним (для мобільних)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});