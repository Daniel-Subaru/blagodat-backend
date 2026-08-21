// ============================================
// render.js — рендеринг товарів з data.js
// ============================================

// Отримуємо HTML для статусу наявності (якщо функція не в data.js)
function getStockHtml(product) {
    if (!product.stock || product.stock <= 0) {
        return '<div class="stock-badge out-of-stock">❌ Немає в наявності</div>';
    } else if (product.stock < 5) {
        return `<div class="stock-badge low-stock">⚠️ Залишилось ${product.stock} шт.</div>`;
    } else {
        return `<div class="stock-badge in-stock">✅ Є в наявності (${product.stock} шт.)</div>`;
    }
}

// Рендеринг товарів на сторінці категорії
function renderCategoryProducts(categoryKey) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    const products = getProductsByCategory(categoryKey);
    const totalSpan = document.getElementById('totalCount');
    const resultsSpan = document.getElementById('resultsCount');
    
    if (totalSpan) totalSpan.textContent = products.length;
    if (resultsSpan) resultsSpan.textContent = products.length;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="search-no-results">😔 Товарів у цій категорії поки немає</div>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const finalPrice = getFinalPrice(product);
        const badgeHtml = getBadgeHtml(product);
        const starsHtml = getStarsHtml(product.rating);
        
        // Формуємо HTML ціни зі знижкою
        let priceHtml = '';
        if (product.discount && product.discount > 0) {
            priceHtml = `<span style="text-decoration:line-through; font-size:0.8rem; margin-right:6px;">${product.originalPrice} ₴</span> 
                         <span style="color:#e05555; font-weight:800;">${finalPrice} ₴</span>`;
        } else {
            priceHtml = `<span style="font-weight:800;">${finalPrice} ₴</span>`;
        }
        
        // Отримуємо зображення
        const imageUrl = product.image || (product.images && product.images[0]) || '';
        
        return `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}" data-price="${finalPrice}">
                ${badgeHtml}
                <div class="product-card__img-wrap">
                    <div class="product-card__img" style="background:${product.bgColor || '#ddd'}; display:flex; align-items:center; justify-content:center;">
                        ${imageUrl ? 
                            `<img src="${imageUrl}" alt="${product.name}" class="product-card__image" loading="lazy">` : 
                            `<span class="product-card__emoji">${product.emoji || '📦'}</span>`
                        }
                    </div>
                    <div class="product-card__overlay">
                        <button class="product-card__quick" data-id="${product.id}">Швидкий перегляд</button>
                    </div>
                </div>
                <div class="product-card__body">
                    <p class="product-card__cat">${product.categoryName}</p>
                    <h3 class="product-card__name">${product.name}</h3>
                    <div class="product-card__stars">${starsHtml}</div>
                    ${product.sku ? `<div class="product-sku">Артикул: ${product.sku}</div>` : ''}
                    <div class="product-card__footer">
                        <div class="product-card__price">${priceHtml}</div>
                        ${getStockHtml(product)}
                        <button class="product-card__buy btn btn--primary btn--sm" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
                            🛒 ${product.stock > 0 ? 'В кошик' : 'Немає'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    attachProductEvents();
}

// Рендеринг популярних товарів на головній сторінці
function renderPopularProducts(limit = 8) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    const allProducts = getAllProducts();
    // Беремо популярні товари (isHit) або перші N
    let popular = allProducts.filter(p => p.isHit).slice(0, limit);
    if (popular.length < limit) {
        popular = allProducts.slice(0, limit);
    }
    
    container.innerHTML = popular.map(product => {
        const finalPrice = getFinalPrice(product);
        const badgeHtml = getBadgeHtml(product);
        const starsHtml = getStarsHtml(product.rating);
        
        let priceHtml = '';
        if (product.discount && product.discount > 0) {
            priceHtml = `<span style="text-decoration:line-through; font-size:0.8rem; margin-right:6px;">${product.originalPrice} ₴</span> 
                         <span style="color:#e05555; font-weight:800;">${finalPrice} ₴</span>`;
        } else {
            priceHtml = `<span style="font-weight:800;">${finalPrice} ₴</span>`;
        }
        
        const imageUrl = product.image || (product.images && product.images[0]) || '';
        
        return `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}" data-price="${finalPrice}">
                ${badgeHtml}
                <div class="product-card__img-wrap">
                    <div class="product-card__img" style="background:${product.bgColor || '#ddd'}; display:flex; align-items:center; justify-content:center;">
                        ${imageUrl ? 
                            `<img src="${imageUrl}" alt="${product.name}" class="product-card__image" loading="lazy">` : 
                            `<span class="product-card__emoji">${product.emoji || '📦'}</span>`
                        }
                    </div>
                    <div class="product-card__overlay">
                        <button class="product-card__quick" data-id="${product.id}">Швидкий перегляд</button>
                    </div>
                </div>
                <div class="product-card__body">
                    <p class="product-card__cat">${product.categoryName}</p>
                    <h3 class="product-card__name">${product.name}</h3>
                    <div class="product-card__stars">${starsHtml}</div>
                    ${product.sku ? `<div class="product-sku">Артикул: ${product.sku}</div>` : ''}
                    <div class="product-card__footer">
                        <div class="product-card__price">${priceHtml}</div>
                        ${getStockHtml(product)}
                        <button class="product-card__buy btn btn--primary btn--sm" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
                            🛒 ${product.stock > 0 ? 'В кошик' : 'Немає'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    attachProductEvents();
}

// Прив'язка подій до кнопок
function attachProductEvents() {
    // Кнопки "В кошик"
    document.querySelectorAll('.product-card__buy').forEach(btn => {
        btn.removeEventListener('click', buyHandler);
        btn.addEventListener('click', buyHandler);
    });
    
    // Кнопки "Швидкий перегляд"
    document.querySelectorAll('.product-card__quick').forEach(btn => {
        btn.removeEventListener('click', quickViewHandler);
        btn.addEventListener('click', quickViewHandler);
    });
}

// Обробник додавання в кошик
function buyHandler(e) {
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = getProductById(productId);
    if (product && product.stock > 0) {
        const finalPrice = getFinalPrice(product);
        if (typeof addToCart === 'function') {
            addToCart(productId, finalPrice);
        }
    }
}

// Обробник швидкого перегляду
function quickViewHandler(e) {
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    if (typeof openQuickView === 'function') {
        openQuickView(productId);
    }
}

// Функція пошуку на сторінці категорії
function initCategorySearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const resultsSpan = document.getElementById('resultsCount');
    const totalSpan = document.getElementById('totalCount');
    
    if (!searchInput) return;
    
    function filterProducts() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const name = card.querySelector('.product-card__name')?.textContent?.toLowerCase() || '';
            const matches = searchTerm === '' || name.includes(searchTerm);
            card.classList.toggle('hidden', !matches);
            if (matches) visibleCount++;
        });
        
        if (resultsSpan) resultsSpan.textContent = visibleCount;
        if (totalSpan && totalSpan.textContent === '0') {
            totalSpan.textContent = cards.length;
        }
        if (clearBtn) clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }
    
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterProducts, 200);
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterProducts();
            searchInput.focus();
        });
    }
    
    // Початковий підрахунок
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        if (totalSpan) totalSpan.textContent = cards.length;
        if (resultsSpan) resultsSpan.textContent = cards.length;
    }, 100);
}