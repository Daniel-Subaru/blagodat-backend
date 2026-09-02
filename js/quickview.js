// ============================================
// quickview.js — ШВИДКИЙ ПЕРЕГЛЯД (МОБІЛЬНА ВЕРСІЯ)
// ============================================

(function() {
    if (window.__quickviewModuleLoaded) {
        return;
    }
    window.__quickviewModuleLoaded = true;

    let currentProduct = null;
    let currentImages = [];
    let currentIndex = 0;

    function createQuickViewModal() {
        if (document.getElementById('quickviewModal')) {
            ensureQuickViewModalStructure();
            return;
        }
        
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
                            <div class="modal-author" id="modalAuthor"></div>
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
        ensureQuickViewModalStructure();
    }

    function ensureQuickViewModalStructure() {
        const modal = document.getElementById('quickviewModal');
        if (!modal) return;

        const info = modal.querySelector('.modal-info');
        if (!info) return;

        if (!document.getElementById('modalAuthor')) {
            const author = document.createElement('div');
            author.className = 'modal-author';
            author.id = 'modalAuthor';
            const rating = document.getElementById('modalRating');
            if (rating) {
                info.insertBefore(author, rating);
            } else {
                info.appendChild(author);
            }
        }

        if (!document.getElementById('modalSkuStock')) {
            const sku = document.createElement('div');
            sku.className = 'modal-sku-stock';
            sku.id = 'modalSkuStock';
            const rating = document.getElementById('modalRating');
            if (rating) {
                info.insertBefore(sku, rating.nextSibling);
            } else {
                info.appendChild(sku);
            }
        }
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
        return `<div style="font-size:0.85rem; margin:0.5rem 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <span style="color:var(--text-muted);">Артикул: ${sku || '----'}</span>
                    ${stockHtml}
                </div>`;
    }

    function formatModalDescription(text) {
        if (!text) return 'Опис відсутній';

        const normalized = String(text).replace(/\r\n/g, '\n').trim();
        const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean);
        const safeLines = lines.map(line => {
            const safe = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            if (/^[-*•]/.test(line)) {
                return `<li>${safe.replace(/^[-*•]\s*/, '')}</li>`;
            }

            return safe
                .replace(/\s{2,}/g, ' ')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        });

        const paragraphs = [];
        let listItems = [];

        safeLines.forEach((line) => {
            if (line.startsWith('<li>')) {
                listItems.push(line);
            } else {
                if (listItems.length) {
                    paragraphs.push(`<ul>${listItems.join('')}</ul>`);
                    listItems = [];
                }
                paragraphs.push(`<p>${line}</p>`);
            }
        });

        if (listItems.length) {
            paragraphs.push(`<ul>${listItems.join('')}</ul>`);
        }

        return paragraphs.join('');
    }

    // ========== МОБІЛЬНЕ ВІДОБРАЖЕННЯ ==========
    function applyMobileQuickViewLayout() {
        const modalBody = document.querySelector('.modal-body');
        const modalInfo = document.querySelector('.modal-info');
        const modalDescription = document.getElementById('modalDesc');
        const modalCarousel = document.querySelector('.modal-carousel');
        const modal = document.getElementById('quickviewModal');
        const isMobile = window.innerWidth <= 768;

        // Загальні налаштування модального вікна
        if (modal) {
            modal.style.height = isMobile ? '100dvh' : '';
            modal.style.maxHeight = isMobile ? '100dvh' : '90vh';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';
            modal.style.overflow = 'hidden';
        }

        // Тіло модального вікна
        if (modalBody) {
            modalBody.style.display = 'flex';
            modalBody.style.flexDirection = isMobile ? 'column' : 'row';
            modalBody.style.flex = '1';
            modalBody.style.overflow = 'hidden';
            modalBody.style.height = isMobile ? '100%' : '';
            modalBody.style.maxHeight = isMobile ? '100%' : '';
            modalBody.style.padding = isMobile ? '0.5rem' : '1.5rem';
            modalBody.style.gap = isMobile ? '0.5rem' : '1.5rem';
        }

        // Карусель
        if (modalCarousel) {
            modalCarousel.style.flex = isMobile ? '0 0 auto' : '1.2';
            modalCarousel.style.maxHeight = isMobile ? '38vh' : '';
            modalCarousel.style.minHeight = isMobile ? '200px' : '';
            modalCarousel.style.width = isMobile ? '100%' : '';
        }

        // Зображення в каруселі
        const carouselMain = document.querySelector('.carousel-main');
        if (carouselMain) {
            carouselMain.style.aspectRatio = isMobile ? '1/1' : '1/1';
            carouselMain.style.height = isMobile ? 'auto' : '';
            carouselMain.style.maxHeight = isMobile ? '40vh' : '';
            carouselMain.style.minHeight = isMobile ? '180px' : '';
            carouselMain.style.display = 'flex';
            carouselMain.style.alignItems = 'center';
            carouselMain.style.justifyContent = 'center';
            carouselMain.style.overflow = 'hidden';
        }

        const carouselImg = document.getElementById('carouselImg');
        if (carouselImg) {
            carouselImg.style.maxWidth = '100%';
            carouselImg.style.maxHeight = isMobile ? '40vh' : '';
            carouselImg.style.objectFit = 'contain';
            carouselImg.style.width = 'auto';
            carouselImg.style.height = 'auto';
        }

        // Інформаційна частина
        if (modalInfo) {
            modalInfo.style.flex = '1';
            modalInfo.style.minWidth = isMobile ? '0' : '250px';
            modalInfo.style.maxHeight = isMobile ? '100%' : '';
            modalInfo.style.overflowY = 'auto';
            modalInfo.style.overflowX = 'hidden';
            modalInfo.style.overflow = 'auto';
            modalInfo.style.height = isMobile ? '100%' : '';
            modalInfo.style.padding = isMobile ? '0.25rem 0.25rem 0.75rem' : '';
            modalInfo.style.position = 'relative';
            modalInfo.style.display = 'flex';
            modalInfo.style.flexDirection = 'column';
            modalInfo.style.flexGrow = '1';
            modalInfo.style.webkitOverflowScrolling = 'touch';
        }

        // Опис товару
        if (modalDescription) {
            modalDescription.style.maxHeight = isMobile ? 'none' : '260px';
            modalDescription.style.minHeight = isMobile ? '80px' : '120px';
            modalDescription.style.height = isMobile ? 'auto' : '';
            modalDescription.style.overflowY = 'auto';
            modalDescription.style.overflowX = 'hidden';
            modalDescription.style.overflow = 'auto';
            modalDescription.style.webkitOverflowScrolling = 'touch';
            modalDescription.style.paddingRight = isMobile ? '0.25rem' : '0.5rem';
            modalDescription.style.paddingBottom = isMobile ? '0.5rem' : '';
            modalDescription.style.lineHeight = '1.7';
            modalDescription.style.fontSize = isMobile ? '0.9rem' : '0.95rem';
            modalDescription.style.wordBreak = 'break-word';
            modalDescription.style.overflowWrap = 'anywhere';
            modalDescription.style.whiteSpace = 'normal';
            modalDescription.style.hyphens = 'auto';
            modalDescription.style.display = 'block';
            modalDescription.style.flex = isMobile ? '1' : '';
            modalDescription.style.marginBottom = isMobile ? '0.5rem' : '';
        }

        // Додаткові адаптації для дуже маленьких екранів
        if (window.innerWidth <= 480) {
            if (modalInfo) {
                modalInfo.style.padding = '0.15rem 0.3rem 0.3rem';
            }
            if (modalDescription) {
                modalDescription.style.fontSize = '0.85rem';
                modalDescription.style.minHeight = '60px';
                modalDescription.style.paddingRight = '0.15rem';
            }
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                modalTitle.style.fontSize = '1.1rem';
            }
            const modalPrice = document.querySelector('.modal-price');
            if (modalPrice) {
                modalPrice.style.fontSize = '0.9rem';
            }
            const carouselBtn = document.querySelectorAll('.carousel-btn');
            carouselBtn.forEach(btn => {
                btn.style.width = '28px';
                btn.style.height = '28px';
                btn.style.fontSize = '0.9rem';
            });
        }
    }

    // ========== ДОПОМІЖНА ФУНКЦІЯ ДЛЯ РОЗВ'ЯЗАННЯ ШЛЯХІВ ==========
    function resolveAssetUrl(url) {
        if (!url) return url;
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        if (url.startsWith('/')) {
            return url;
        }
        return url;
    }

    // ========== ВІДКРИТТЯ МОДАЛЬНОГО ВІКНА ==========
    window.openQuickView = function(productId) {
        // getProductById() уже повертає нормалізований товар (з правильно закодованими шляхами
        // до зображень), тому повторний виклик normalizeProduct() тут НЕ потрібен —
        // інакше URL зображень кодуються двічі (наприклад "%D0" стає "%25D0") і картинка не завантажується.
        const product = typeof getProductById === 'function' ? getProductById(parseInt(productId)) : null;
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
        const authorEl = document.getElementById('modalAuthor');
        if (authorEl) {
            authorEl.innerHTML = product.category === 'books' && product.author ? `Автор: <strong>${product.author}</strong>` : '';
        }
        document.getElementById('modalRating').innerHTML = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        const modalDescription = document.getElementById('modalDesc');
        if (modalDescription) {
            modalDescription.innerHTML = formatModalDescription(product.description || 'Опис відсутній');
        }
        
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

        // Застосовуємо мобільне відображення з затримкою для правильного рендерингу
        setTimeout(() => {
            applyMobileQuickViewLayout();
        }, 50);
        
        const addBtn = document.getElementById('modalAddToCart');
        if (addBtn) {
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

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(applyMobileQuickViewLayout, 200);
        });
        
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