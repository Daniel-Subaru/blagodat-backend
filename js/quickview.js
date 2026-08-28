// ============================================
// quickview.js — ШВИДКИЙ ПЕРЕГЛЯД (ОПТИМІЗОВАНИЙ)
// ============================================

(function() {
    let currentProduct = null;
    let currentImages = [];
    let currentIndex = 0;

    function createQuickViewModal() {
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
                            <div class="modal-sku-stock" id="modalSkuStock"></div>
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

    function getStockStatusHtml(stock, sku) {
        let stockHtml = '';
        if (!stock || stock <= 0) {
            stockHtml = '<span style="color:#c62828; font-weight:600;">❌ Немає в наявності</span>';
        } else if (stock < 5) {
            stockHtml = `<span style="color:#e65100; font-weight:600;">⚠️ Залишилось ${stock} шт.</span>`;
        } else {
            stockHtml = `<span style="color:#2e7d32; font-weight:600;">✅ Є в наявності (${stock} шт.)</span>`;
        }
        return `<div style="font-size:0.85rem; margin:0.5rem 0; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted);">Артикул: ${sku || '----'}</span>
                    ${stockHtml}
                </div>`;
    }

    window.openQuickView = function(productId) {
        const product = getProductById(parseInt(productId));
        if (!product) {
            console.error('Товар не знайдено:', productId);
            return;
        }
        
        currentProduct = product;
        currentImages = (product.images || []).map(resolveAssetUrl);
        if (currentImages.length === 0 && product.image) {
            currentImages = [resolveAssetUrl(product.image)];
        }
        if (currentImages.length === 0) {
            currentImages = [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${product.bgColor?.replace('#', '%23') || '%23f0e4d8'}'/%3E%3Ctext x='50' y='55' font-size='50' text-anchor='middle' dy='.3em'%3E${product.emoji || '📦'}%3C/text%3E%3C/svg%3E`];
        }
        currentIndex = 0;
        
        const finalPrice = getFinalPrice(product);
        
        document.getElementById('modalCategory').textContent = product.categoryName || product.category;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalRating').innerHTML = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        document.getElementById('modalDesc').textContent = product.description || 'Опис відсутній';
        
        // Додаємо артикул та наявність
        const skuStockContainer = document.getElementById('modalSkuStock');
        if (skuStockContainer) {
            skuStockContainer.innerHTML = getStockStatusHtml(product.stock, product.sku);
        }
        
        const priceContainer = document.getElementById('modalPrice');
        if (product.discount && product.discount > 0) {
            priceContainer.innerHTML = `
                <span style="text-decoration:line-through; font-size:1rem; color:var(--text-muted); margin-right:10px;">${product.originalPrice} ₴</span>
                <span style="font-size:2rem; font-weight:800; color:#e05555;">${finalPrice} ₴</span>
                <span style="font-size:0.8rem; color:var(--accent);">(-${product.discount}%)</span>
            `;
        } else {
            priceContainer.innerHTML = `<span style="font-size:2rem; font-weight:800; color:var(--accent);">${finalPrice} ₴</span>`;
        }
        
        updateCarousel(0);
        
        const overlay = document.getElementById('quickviewOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        const addBtn = document.getElementById('modalAddToCart');
        if (addBtn) {
            // Клонуємо кнопку, щоб видалити старі обробники
            const newBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newBtn, addBtn);
            newBtn.id = 'modalAddToCart';
            
            if (product.stock > 0) {
                newBtn.innerHTML = '🛒 Додати в кошик';
                newBtn.disabled = false;
                newBtn.onclick = function() {
                    if (typeof addToCart === 'function') {
                        addToCart(productId);
                    }
                    closeQuickView();
                };
            } else {
                newBtn.innerHTML = '❌ Немає в наявності';
                newBtn.disabled = true;
                newBtn.style.opacity = '0.5';
                newBtn.style.cursor = 'not-allowed';
            }
        }
    };

    window.closeQuickView = function() {
        const overlay = document.getElementById('quickviewOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        currentProduct = null;
    };

    function openZoom(imgSrc) {
        const zoomOverlay = document.getElementById('zoomOverlay');
        const zoomImg = document.getElementById('zoomImg');
        if (zoomOverlay && zoomImg && imgSrc) {
            zoomImg.src = imgSrc;
            zoomOverlay.classList.add('active');
        }
    }

    function closeZoom() {
        const zoomOverlay = document.getElementById('zoomOverlay');
        if (zoomOverlay) zoomOverlay.classList.remove('active');
    }

    function bindQuickViewEvents() {
        const closeBtn = document.getElementById('modalCloseBtn');
        const overlay = document.getElementById('quickviewOverlay');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const zoomOverlay = document.getElementById('zoomOverlay');
        const carouselImg = document.getElementById('carouselImg');
        
        if (closeBtn) {
            closeBtn.removeEventListener('click', closeQuickView);
            closeBtn.addEventListener('click', closeQuickView);
        }
        if (overlay) {
            overlay.removeEventListener('click', closeQuickView);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeQuickView();
            });
        }
        if (prevBtn) {
            prevBtn.removeEventListener('click', prevImage);
            prevBtn.addEventListener('click', prevImage);
        }
        if (nextBtn) {
            nextBtn.removeEventListener('click', nextImage);
            nextBtn.addEventListener('click', nextImage);
        }
        if (zoomOverlay) {
            zoomOverlay.removeEventListener('click', closeZoom);
            zoomOverlay.addEventListener('click', closeZoom);
        }
        if (carouselImg) {
            carouselImg.removeEventListener('click', () => {});
            carouselImg.addEventListener('click', () => {
                const img = document.getElementById('carouselImg');
                if (img && img.src && !img.src.includes('data:image/svg')) {
                    openZoom(img.src);
                }
            });
        }
        
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
    }
    
    function handleKeydown(e) {
        const overlay = document.getElementById('quickviewOverlay');
        if (!overlay || !overlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeQuickView();
            closeZoom();
        }
        if (e.key === 'ArrowLeft') {
            prevImage();
        }
        if (e.key === 'ArrowRight') {
            nextImage();
        }
    }

    // Ініціалізація
    document.addEventListener('DOMContentLoaded', () => {
        createQuickViewModal();
        bindQuickViewEvents();
    });
})();