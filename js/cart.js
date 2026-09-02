// ============================================
// cart.js — УНІВЕРСАЛЬНИЙ КОШИК
// Працює на всіх сторінках автоматично
// Підтримує знижки з data.js
// ============================================

(function() {
    // ========== СТАН КОШИКА ==========
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // ========== ЗБЕРІГАННЯ ==========
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // ========== ОТРИМАННЯ ЦІНИ ЗІ ЗНИЖКОЮ З КАРТКИ ==========
    function getPriceFromCard(card) {
        // Спосіб 1: шукаємо червону ціну (зі знижкою)
        const redPriceSpan = card.querySelector('.product-card__price span[style*="color:#e05555"]');
        if (redPriceSpan) {
            const match = redPriceSpan.textContent.match(/(\d+[\s]?\d*)/);
            if (match) {
                return parseInt(match[0].replace(/\s/g, ''), 10);
            }
        }
        
        // Спосіб 2: беремо з data-price
        const dataPrice = parseInt(card.dataset.price, 10);
        if (!isNaN(dataPrice)) {
            return dataPrice;
        }
        
        // Спосіб 3: парсимо звичайну ціну
        const priceSpan = card.querySelector('.product-card__price');
        if (priceSpan) {
            const match = priceSpan.textContent.match(/(\d+[\s]?\d*)/);
            if (match) {
                return parseInt(match[0].replace(/\s/g, ''), 10);
            }
        }
        
        return 0;
    }
    
    function syncProductStockUI(productId) {
        const product = getProductById(productId);
        if (!product) return;

        document.querySelectorAll(`.product-card[data-id="${productId}"]`).forEach(card => {
            const buyBtn = card.querySelector('.product-card__buy');
            const stockBadge = card.querySelector('.stock-badge');

            if (buyBtn) {
                const available = product.stock > 0;
                buyBtn.disabled = !available;
                buyBtn.textContent = `🛒 ${available ? 'В кошик' : 'Немає'}`;
                buyBtn.title = available ? 'Додати в кошик' : 'Товар відсутній';
            }

            if (stockBadge) {
                stockBadge.outerHTML = getStockHtml(product);
            }
        });
    }

    // ========== ДОДАВАННЯ В КОШИК ==========
    window.addToCart = function(productId, customPrice = null) {
        const card = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (!card) {
            console.warn('Товар не знайдено:', productId);
            return;
        }

        const name = card.querySelector('.product-card__name')?.textContent || 'Товар';
        const emoji = card.querySelector('.product-card__emoji')?.textContent || '📦';
        const bgColor = card.querySelector('.product-card__img')?.style?.background || '#ddd';
        const product = getProductById(productId);

        if (!product) {
            console.warn('Товар не знайдено в базі даних:', productId);
            return;
        }

        const isAlreadyInCart = cart.some(item => item.id == productId);
        if (product.stock <= 0 && !isAlreadyInCart) {
            showToast(`❌ "${product.name}" вже немає в наявності`);
            return;
        }

        if (product.stock <= 0 && isAlreadyInCart) {
            showToast(`❌ "${product.name}" більше немає в наявності`);
            return;
        }

        const imageUrl = resolveAssetUrl(product?.image || product?.images?.[0] || '');
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                const cartItem = document.querySelector(`.cart-item[data-item-id="${productId}"] .cart-item__thumb`);
                if (cartItem) {
                    cartItem.style.background = bgColor;
                    cartItem.textContent = emoji;
                }
            };
        }

        let finalPrice = customPrice;
        if (!finalPrice) {
            finalPrice = getPriceFromCard(card);
        }

        const existing = cart.find(item => item.id == productId);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({
                id: productId,
                name: name,
                price: finalPrice,
                emoji: emoji,
                bgColor: bgColor,
                image: imageUrl,
                qty: 1
            });
        }

        product.stock = Math.max(0, Number(product.stock || 0) - 1);
        saveCart();
        updateCartDisplay();
        updateCartCount();
        syncProductStockUI(productId);
        showToast(`🛒 "${name}" додано до кошика (${finalPrice} ₴)`);
        animateCartButton();
    };
    
    // ========== ВИДАЛЕННЯ З КОШИКА ==========
    window.removeFromCart = function(productId) {
        const item = cart.find(i => i.id == productId);
        if (!item) return;

        const product = getProductById(productId);
        if (product) {
            const sourceProduct = STORE_DATA && STORE_DATA[productId] ? STORE_DATA[productId] : product;
            sourceProduct.stock = Math.max(0, Number(sourceProduct.stock || 0) + Number(item.qty || 0));
        }

        showToast(`🗑️ "${item.name}" видалено з кошика`);
        cart = cart.filter(i => i.id != productId);
        saveCart();
        updateCartDisplay();
        updateCartCount();
        syncProductStockUI(productId);
    };
    
    // ========== ЗМІНА КІЛЬКОСТІ ==========
    window.updateCartQty = function(productId, delta) {
        const item = cart.find(i => i.id == productId);
        if (!item) return;

        const product = getProductById(productId);
        if (!product) return;

        if (delta > 0) {
            if (product.stock <= 0) {
                showToast(`❌ "${product.name}" більше немає в наявності`);
                return;
            }
            item.qty += 1;
            product.stock = Math.max(0, Number(product.stock || 0) - 1);
        } else {
            if (item.qty <= 1) {
                const removedQty = item.qty;
                product.stock = Math.max(0, Number(product.stock || 0) + removedQty);
                cart = cart.filter(i => i.id != productId);
                saveCart();
                updateCartDisplay();
                updateCartCount();
                syncProductStockUI(productId);
                showToast(`🗑️ "${item.name}" видалено з кошика`);
                return;
            }
            item.qty -= 1;
            product.stock = Math.max(0, Number(product.stock || 0) + 1);
        }

        saveCart();
        updateCartDisplay();
        updateCartCount();
        syncProductStockUI(productId);
    };
    
    // ========== ОНОВЛЕННЯ ВІДОБРАЖЕННЯ КОШИКА ==========
    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotalSpan = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartItems) cartItems.innerHTML = '';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'flex';
        
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (cartTotalSpan) cartTotalSpan.textContent = formatPrice(total);
        
        cartItems.innerHTML = cart.map(item => `
            <li class="cart-item" data-item-id="${item.id}">
                <div class="cart-item__thumb"> ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="background:${item.bgColor || '#ccc'}; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${item.emoji || '📦'}</div>`}
                </div>
                <div class="cart-item__info">
                    <div class="cart-item__name">${escapeHtml(item.name)}</div>
                    <div class="cart-item__qty-row">
                        <button class="cart-item__qty-btn" data-action="dec" data-id="${item.id}">−</button>
                        <span class="cart-item__qty-num">${item.qty}</span>
                        <button class="cart-item__qty-btn" data-action="inc" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item__price-col">
                    <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
                    <button class="cart-item__remove" data-id="${item.id}">Видалити</button>
                </div>
            </li>
        `).join('');
        
        // Прив'язуємо події
        document.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
            btn.removeEventListener('click', handleQtyClick);
            btn.addEventListener('click', handleQtyClick);
        });
        
        document.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.removeEventListener('click', handleRemoveClick);
            btn.addEventListener('click', handleRemoveClick);
        });
    }
    
    function handleQtyClick(e) {
        const id = e.currentTarget.dataset.id;
        const action = e.currentTarget.dataset.action;
        updateCartQty(id, action === 'inc' ? 1 : -1);
    }
    
    function handleRemoveClick(e) {
        const id = e.currentTarget.dataset.id;
        removeFromCart(id);
    }
    
    // ========== ОНОВЛЕННЯ ЛІЧИЛЬНИКА ==========
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        const total = cart.reduce((sum, i) => sum + i.qty, 0);
        cartCount.textContent = total;
        cartCount.classList.toggle('visible', total > 0);
    }
    
    // ========== ФОРМАТУВАННЯ ЦІНИ ==========
    function formatPrice(price) {
        return price.toLocaleString('uk-UA') + ' ₴';
    }
    
    // ========== TOUTCТИ ПОВІДОМЛЕННЯ ==========
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
    }
    
    // ========== АНІМАЦІЯ КНОПКИ КОШИКА ==========
    function animateCartButton() {
        const cartBtn = document.getElementById('cartBtn');
        if (!cartBtn) return;
        cartBtn.classList.add('bump');
        setTimeout(() => cartBtn.classList.remove('bump'), 400);
    }
    
    // ========== ВІДКРИТТЯ/ЗАКРИТТЯ КОШИКА ==========
    window.openCart = function() {
        document.getElementById('cartSidebar')?.classList.add('open');
        document.getElementById('cartOverlay')?.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeCart = function() {
        document.getElementById('cartSidebar')?.classList.remove('open');
        document.getElementById('cartOverlay')?.classList.remove('visible');
        document.body.style.overflow = '';
    };
    
    // ========== ESCAPE ДЛЯ ЗАКРИТТЯ ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
    
    // ========== ІНІЦІАЛІЗАЦІЯ ==========
    function initCartSystem() {
        updateCartDisplay();
        updateCartCount();
        
        // Кнопка кошика
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.removeEventListener('click', openCart);
            cartBtn.addEventListener('click', openCart);
        }
        
        // Закриття кошика
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.removeEventListener('click', closeCart);
            cartClose.addEventListener('click', closeCart);
        }
        
        // Оверлей
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.removeEventListener('click', closeCart);
            cartOverlay.addEventListener('click', closeCart);
        }

        const checkoutBtn = document.querySelector('.cart-sidebar__footer .btn--full');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = '/checkout.html';
            });
        }
    }
    
    // ========== ДОДАЄМО ПОДІЇ ДЛЯ КНОПОК "В КОШИК" ==========
    function attachBuyButtons() {
        document.querySelectorAll('.product-card__buy').forEach(btn => {
            btn.removeEventListener('click', buyClickHandler);
            btn.addEventListener('click', buyClickHandler);
        });
    }
    
    function buyClickHandler(e) {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        if (id) {
            addToCart(id);
        }
    }
    
    // ========== ЕКРАНУВАННЯ HTML ==========
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ========== СПОСТЕРІГАЧ ДЛЯ НОВИХ КНОПОК ==========
    const observer = new MutationObserver(() => {
        attachBuyButtons();
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        initCartSystem();
        attachBuyButtons();
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();