// ============================================
// data.js — ЄДИНА БАЗА ДАНИХ МАГАЗИНУ
// Змінюйте ТІЛЬКИ ТУТ — оновиться всюди!
// ============================================

const STORE_DATA = {
    // === БІБЛІЇ (id: 101-199) ===
    101: {
        id: 101,
        name: "Сучасний переклад Біблії (CUV)",
        translation: "cuv",
        sku: "bible-cuv",
        stock: 5,
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 2500,
        discount: 0, // 10% знижки
        rating: 5,
        image: "/img/Bible/CUV.jpg",
        emoji: "📖",
        bgColor: "#c9b49a",
        description: "🔸Головний перекладач о. Р. Турконяк 🔸 Шкіряна обкладинка 📏Розмір 18 /25 см 🔸Замок 🔸Індекси 🔸Золотий зріз",
        images: ["/img/Bible/bible_leather.jpg", "/img/Bible/leather.jpg"],
        isHit: true
    },
    102: {
        id: 102,
        name: "Дитяча ілюстрована Біблія",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 450,
        discount: 5,
        rating: 4,
        image: "img/Bible/3.jpg",
        emoji: "📘",
        bgColor: "#b5c4b1",
        description: "Яскраві ілюстрації, адаптований текст для дітей.",
        images: ["img/Bible/3.jpg"]
    },
    103: {
        id: 103,
        name: "Біблія великим шрифтом",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 1200,
        discount: 10,
        rating: 5,
        image: "img/Bible/leather.jpg",
        emoji: "✝️",
        bgColor: "#d4c5a5",
        description: "Подарункове видання. Шрифт 14pt.",
        images: ["img/Bible/leather.jpg"],
        isSale: true
    },
    104: {
        id: 104,
        name: "Студійна Біблія з коментарями",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 800,
        discount: 10,
        rating: 4,
        image: "img/Bible/bible_leather.jpg",
        emoji: "🕯️",
        bgColor: "#a5b8d4",
        description: "Детальні коментарі, карти, словник термінів.",
        images: ["img/Bible/bible_leather.jpg"],
        isSale: true
    },
    105: {
        id: 105,
        name: "Біблія з гравіюванням",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 1990,
        discount: 10,
        rating: 5,
        image: "img/Bible/3.jpg",
        emoji: "📜",
        bgColor: "#d4a5a5",
        description: "Іменне гравіювання на обкладинці.",
        images: ["img/Bible/3.jpg"],
        isSale: true
    },
    106: {
        id: 106,
        name: "Новий Заповіт (кишеньковий)",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 540,
        discount: 5,
        rating: 4,
        image: "img/Bible/leather.jpg",
        emoji: "🙏",
        bgColor: "#c5a5d4",
        description: "Зручний формат, завжди можна взяти з собою.",
        images: ["img/Bible/leather.jpg"]
    },
    107: {
        id: 107,
        name: "Біблія з позолотою (CUV)", 
        translation: "cuv",
        sku: "bible-cuv",
        stock: 10,
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 2000,
        discount: 10,
        rating: 5,
        image: "img/Bible/bible_leather.jpg",
        emoji: "📜",
        bgColor: "#d4a5a5",
        description: "Позолочена обкладинка.",
        images: ["img/Bible/bible_leather.jpg"],
        isSale: true
    },
    108: {
        id: 108,
        name: "Біблія з індексом",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 890,
        discount: 0,
        rating: 4,
        image: "img/Bible/3.jpg",
        emoji: "📚",
        bgColor: "#c5a5d4",
        description: "Біблія з індексом та словником.",
        images: ["img/Bible/3.jpg"],
        isNew: true
    },
    109: {
        id: 109,
        name: "Біблія з вишивкою",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 1500,
        discount: 0,
        rating: 5,
        image: "img/Bible/leather.jpg",
        emoji: "📜",
        bgColor: "#d4a5a5",
        description: "Обкладинка з вишивкою ручної роботи.",
        images: ["img/Bible/leather.jpg"],
        isNew: true
    },
    110: {
        id: 110,
        name: "Біблія з гравіюванням",
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 1990,
        discount: 10,
        rating: 5,
        image: "img/Bible/3.jpg",
        emoji: "📜",
        bgColor: "#d4a5a5",
        description: "Іменне гравіювання на обкладинці.",
        images: ["img/Bible/3.jpg"],
        isSale: true
    },

    // === КАРТИНИ (id: 201-299) ===
    201: {
        id: 201,
        name: "Голуб миру",
        category: "paintings",
        categoryName: "Картини",
        originalPrice: 890,
        discount: 0,
        rating: 5,
        image: "img/Bible/3.jpg",
        emoji: "🕊️",
        bgColor: "#d4a5a5",
        description: "Ручна робота, олійний живопис.",
        images: ["img/Bible/3.jpg"],
        isNew: true
    },
    202: {
        id: 202,
        name: "Добрий Пастир",
        category: "paintings",
        categoryName: "Картини",
        originalPrice: 1200,
        discount: 15,
        rating: 5,
        image: "img/Bible/bible_leather.jpg",
        emoji: "🌿",
        bgColor: "#a5b8d4",
        description: "Акрил на полотні.",
        images: ["img/Bible/bible_leather.jpg"],
        isSale: true
    },
    

    // === ГОДИННИКИ (id: 301-399) ===
    301: {
        id: 301,
        name: "Настінний годинник з хрестом",
        category: "clocks",
        categoryName: "Годинники",
        originalPrice: 780,
        discount: 0,
        rating: 4,
        image: "img/Bible/leather.jpg",
        emoji: "🕐",
        bgColor: "#d4c5a5",
        description: "Дерев'яний корпус, тихий механізм.",
        images: ["img/Bible/leather.jpg"]
    },
    302: {
        id: 302,
        name: "Настільний годинник «Молитва»",
        category: "clocks",
        categoryName: "Годинники",
        originalPrice: 500,
        discount: 10,
        rating: 4,
        image: "img/Bible/3.jpg",
        emoji: "⏰",
        bgColor: "#a5d4c5",
        description: "З цитатою з Псалма.",
        images: ["img/Bible/3.jpg"],
        isSale: true
    },

    // === КНИГИ (id: 401-499) ===
    401: {
        id: 401,
        name: "Сила молитви",
        category: "books",
        categoryName: "Книги",
        originalPrice: 280,
        discount: 0,
        rating: 5,
        image: "img/Bible/bible_leather.jpg",
        emoji: "📚",
        bgColor: "#c5a5d4",
        description: "Класика християнської літератури.",
        images: ["img/Bible/bible_leather.jpg"],
        isHit: true
    },
    402: {
        id: 402,
        name: "Навіщо я?",
        category: "books",
        categoryName: "Книги",
        originalPrice: 320,
        discount: 0,
        rating: 5,
        image: "img/Bible/3.jpg",
        emoji: "✍️",
        bgColor: "#d4b5a5",
        description: "Бестселер №1.",
        images: ["img/Bible/3.jpg"],
        isHit: true
    },

    // === ІГРИ (id: 501-599) ===
    501: {
        id: 501,
        name: "Біблійна вікторина",
        category: "games",
        categoryName: "Ігри",
        originalPrice: 450,
        discount: 0,
        rating: 4,
        image: "img/Bible/leather.jpg",
        emoji: "🎲",
        bgColor: "#a5c5d4",
        description: "500 запитань про Біблію.",
        images: ["img/Bible/leather.jpg"]
    },
    502: {
        id: 502,
        name: "Вірші напам'ять",
        category: "games",
        categoryName: "Ігри",
        originalPrice: 380,
        discount: 0,
        rating: 5,
        image: "img/Bible/bible_leather.jpg",
        emoji: "🃏",
        bgColor: "#b5d4a5",
        description: "Запам'ятовуйте вірші граючи.",
        images: ["img/Bible/bible_leather.jpg"],
        isNew: true
    },

    // === ЧАШКИ (id: 601-699) ===
    601: {
        id: 601,
        name: "Чашка Єр.29:11",
        category: "cups",
        categoryName: "Чашки",
        originalPrice: 185,
        discount: 0,
        rating: 5,
        image: "img/Bible/3.jpg",
        emoji: "☕",
        bgColor: "#d4a5c5",
        description: "Кераміка, 350 мл.",
        images: ["img/Bible/3.jpg"]
    },
    602: {
        id: 602,
        name: "Чашка з хрестом",
        category: "cups",
        categoryName: "Чашки",
        originalPrice: 195,
        discount: 15,
        rating: 4,
        image: "img/Bible/leather.jpg",
        emoji: "🫖",
        bgColor: "#a5d4b5",
        description: "Іменне гравіювання.",
        images: ["img/Bible/leather.jpg"],
        isSale: true
    }
};



// ========== ДОПОМІЖНІ ФУНКЦІЇ ==========

function getFinalPrice(product) {
    if (product.discount && product.discount > 0) {
        return Math.round(product.originalPrice * (1 - product.discount / 100));
    }
    return product.originalPrice;
}

function getProductById(id) {
    return STORE_DATA[id] || null;
}

function getProductsByCategory(category) {
    return Object.values(STORE_DATA).filter(p => p.category === category);
}

function getAllProducts() {
    return Object.values(STORE_DATA);
}

function getPriceHtml(product) {
    const finalPrice = getFinalPrice(product);
    let priceHtml = '';
    
    if (product.discount > 0) {
        priceHtml = `<span style="text-decoration:line-through; font-size:0.8rem; margin-right:6px;">${product.originalPrice} ₴</span> 
                     <span style="color:#e05555; font-weight:800;">${finalPrice} ₴</span>`;
    } else {
        priceHtml = `<span style="font-weight:800;">${finalPrice} ₴</span>`;
    }
    
    // Додаємо артикул та наявність
    return `
        <div class="product-sku">Артикул: ${product.sku || '----'}</div>
        <div class="product-price">${priceHtml}</div>
        ${getStockHtml(product)}
    `;
}

function getBadgeHtml(product) {
    if (product.isSale && product.discount > 0) {
        return `<div class="product-card__badge sale">-${product.discount}%</div>`;
    }
    if (product.isHit) return `<div class="product-card__badge">Хіт</div>`;
    if (product.isNew) return `<div class="product-card__badge new">Нове</div>`;
    return '';
}

function getStarsHtml(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// ========== РОБОТА З АРТИКУЛАМИ ТА НАЯВНІСТЮ ==========

// Отримати товар за артикулом (SKU)
function getProductBySku(sku) {
    for (const id in STORE_DATA) {
        if (STORE_DATA[id].sku === sku) {
            return STORE_DATA[id];
        }
    }
    return null;
}

// Перевірити наявність товару
function isInStock(product) {
    return product.stock && product.stock > 0;
}

// Отримати HTML для статусу наявності
function getStockHtml(product) {
    if (!product.stock || product.stock <= 0) {
        return '<span class="stock-badge out-of-stock">❌ Немає в наявності</span>';
    } else if (product.stock < 5) {
        return `<span class="stock-badge low-stock">⚠️ Залишилось ${product.stock} шт.</span>`;
    } else {
        return `<span class="stock-badge in-stock">✅ Є в наявності (${product.stock} шт.)</span>`;
    }
}

// Експорт для Node.js (якщо потрібно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STORE_DATA, getFinalPrice, getProductById, getProductsByCategory, getAllProducts, getPopularProducts, getPriceHtml, getBadgeHtml, getStarsHtml };
}

// Список популярних товарів (можна змінювати)
const POPULAR_PRODUCTS_IDS = [101, 102, 201, 202, 401, 402, 501, 502, 601, 602];
function getPopularProducts(limit = 12) {
    const popular = [];
    for (const id of POPULAR_PRODUCTS_IDS) {
        const product = STORE_DATA[id];
        if (product && popular.length < limit) popular.push(product);
    }
    return popular;
}