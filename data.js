// ============================================
// data.js — ЄДИНА БАЗА ДАНИХ МАГАЗИНУ
// ============================================

// ============================================
// ЯК ДОДАТИ НОВИЙ ТОВАР:
// 1. Скопіюйте блок товару
// 2. Змініть id (унікальний номер)
// 3. Заповніть поля:
//    - id: унікальний номер (для біблій 101-199, картини 201-299, годинники 301-399, книги 401-499, ігри 501-599, чашки 601-699)
//    - name: назва товару
//    - sku: артикул (унікальний)
//    - stock: кількість на складі (0 = немає)
//    - category: "bibles" | "paintings" | "clocks" | "books" | "games" | "cups"
//    - categoryName: "Біблії" | "Картини" | "Годинники" | "Книги" | "Ігри" | "Чашки"
//    - originalPrice: ціна без знижки
//    - discount: знижка у відсотках (0 = немає)
//    - rating: рейтинг (1-5)
//    - image: шлях до головного фото
//    - emoji: емодзі (запасний варіант)
//    - bgColor: колір фону
//    - description: опис товару
//    - images: масив зображень (для каруселі)
//    - isHit: true/false (популярний)
//    - isNew: true/false (новий)
//    - isSale: true/false (зі знижкою)
//    - author: автор (тільки для книг)
//    - translation: "cuv" | "ogienko" | "turkonjak" | "modern" (тільки для біблій)
// ============================================

const STORE_DATA = {
    // === БІБЛІЇ (id: 101-199) ===
    101: {
        id: 101,
        name: "Сучасний переклад Біблії (CUV)",
        sku: "BIB-001",
        stock: 5,
        category: "bibles",
        categoryName: "Біблії",
        translation: "cuv",
        originalPrice: 2500,
        discount: 0,
        rating: 5,
        image: "/img/Bible/CUV.jpg",
        emoji: "📖",
        bgColor: "#c9b49a",
        description: "🔸Головний перекладач о. Р. Турконяк 🔸 Шкіряна обкладинка 📏Розмір 18/25 см 🔸Замок 🔸Індекси 🔸Золотий зріз",
        images: ["/img/Bible/bible_leather.jpg", "/img/Bible/leather.jpg"],
        isHit: true
    },
    102: {
        id: 102,
        name: "Дитяча ілюстрована Біблія",
        sku: "BIB-002",
        stock: 8,
        category: "bibles",
        categoryName: "Біблії",
        originalPrice: 450,
        discount: 5,
        rating: 4,
        image: "img/Bible/3.jpg",
        emoji: "📘",
        bgColor: "#b5c4b1",
        description: "Яскраві ілюстрації, адаптований текст для дітей.",
        images: ["img/Bible/3.jpg"],
        isNew: true
    },
    103: {
        id: 103,
        name: "Біблія великим шрифтом",
        sku: "BIB-003",
        stock: 12,
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
        sku: "BIB-004",
        stock: 5,
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
        sku: "BIB-005",
        stock: 3,
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
        sku: "BIB-006",
        stock: 20,
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
        sku: "BIB-007",
        stock: 10,
        category: "bibles",
        categoryName: "Біблії",
        translation: "cuv",
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
        sku: "BIB-008",
        stock: 10,
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
        sku: "BIB-009",
        stock: 4,
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
        sku: "BIB-010",
        stock: 6,
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
        sku: "ART-001",
        stock: 10,
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
        sku: "ART-002",
        stock: 5,
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
        sku: "CLK-001",
        stock: 8,
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
        sku: "CLK-002",
        stock: 12,
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
        name: "Дисципліна Благодаті",
        author: "Джеррі Бріджес",
        sku: "BOK-001",
        stock: 9,
        category: "books",  
        categoryName: "Книги",
        originalPrice: 360,
        discount: 0,
        rating: 5,
        image: "img/Books/Дисципліта Благодаті.jpg",
        emoji: "📚",
        bgColor: "#c5a5d4",
        description: "Як поєднати Божу благодать і нашу відповідальність у прагненні до святості?\n\nАвтор показує, що духовне зростання — це не пасивне очікування змін, але й не спроба власними силами стати кращим християнином. Бог діє в нас Своєю благодаттю, а ми покликані відповідати на неї.\n\n📖 Для кого ця книга:\n• для тих, хто прагне глибшого духовного життя;\n• для християн, які хочуть перемагати гріх;\n• для служителів та наставників;\n• для всіх, хто бажає краще зрозуміти Божу благодать.",
        images: ["img/Books/Дисципліта Благодаті.jpg", "img/Books/Дисципліта Благодаті 2.jpg"],
        isHit: true
    },
    402: {
        id: 402,
        name: "Убивство Ісуса",
        author: "Білл О’Рейлі & Мартін Дюґард",
        sku: "BOK-002",
        stock: 3,
        category: "books",
        categoryName: "Книги",
        originalPrice: 490,
        discount: 0,
        rating: 4,
        image: "img/Books/Убивство Ісуса.jpg",
        emoji: "✍️",
        bgColor: "#d4b5a5",
        description: "У цій книжці Білл О’Рейлі та Мартін Дюґард детально  розповідають про події, що призвели до страти найвпливовішої Людини за всю історію людства — Ісуса з Назарета. \n\n Дві тисячі років тому римські солдати жорстоко розправилися із цим суперечливим духовним лідером, який здобув народну любов, а нині понад 2,2 мільярда людей і досі слідують вченню Ісуса та вірять, що Він — Бог.\n\n На сторінках цієї фактологічної та захопливої розповіді про життя й часи Ісуса постає багато легендарних історичних постатей: Юлій Цезар, Клеопатра, Цезар Август, Ірод Великий, Понтій Пілат, Іван Хреститель та інші.\n «Убивство Ісуса» занурює читачів у найбуремнішу епоху та розповідає про карколомні політичні й історичні події, які зумовили невідворотну смерть Ісуса й назавжди змінили світ.",
        images: ["img/Books/Убивство Ісуса.jpg"],
        isNew: true
    },
    403: {
        id: 403,
        name: "Божий порядник",
        author: "Аркадіуш Лодзевський",
        sku: "BOK-003",
        stock: 7,
        category: "books",
        categoryName: "Книги",
        originalPrice: 120,
        discount: 0,
        rating: 5,
        image: "img/Books/Божий порядник.jpg",
        emoji: "⚔️",
        bgColor: "#8b7a6e",
        description: "Чи завжди ми живемо так, як хоче Бог? Чи можемо навчитися краще розпізнавати Його волю та довіряти Йому навіть тоді, коли Божий шлях відрізняється від нашого?\n\n У книзі «Божий порядник» Аркадіуш Лодзевський розмірковує про те, як будувати своє життя у співпраці з Богом, відмовляючись від егоїстичного прагнення все контролювати самостійно. Автор заохочує читача подивитися на щоденні рішення, плани, труднощі та бажання крізь призму Божої волі. \n\n Книга допомагає зрозуміти, що справжнє життя у гармонії з Богом вимагає сміливості, віри та готовності слідувати Його провіденню. \n\n\n Для кого: для християн, які бажають духовно зростати, краще пізнавати Божу волю та навчитися щодня співпрацювати з Богом.",
        images: ["img/Books/Божий порядник.jpg"],
        isNew: true
    },
    404: {
        id: 404,
        name: "Битва за увагу",
        author: "Тоні Рейнкі",
        sku: "BOK-004",
        stock: 11,
        category: "books",
        categoryName: "Книги",
        originalPrice: 220,
        discount: 0,
        rating: 4,
        image: "img/Books/Битва за увагу.jpg",
        emoji: "❤️",
        bgColor: "#d4a5a5",
        description: "Зусібіч нас оточують вірусні відео, цифрові зображення та інші видовища, змагаючись за наші час, увагу, хіть і гроші. Тож ми дозволяємо нашим лінивим очам харчуватися всім, що потрапляє в поле зору. Ми практично ніколи не замислюємося про наслідки відсутності в нас візуальної дієти для наших звичок, бажань і прагнень. \n\n  У своїй книжці журналіст Тоні Рейнкі запрошує нас подивитися, що він відкрив для себе, досліджуючи можливості та пастки нашого світу, який орієнтовано на зображення. Також він ділиться красою Великого Видовища, здатного наситити наші душі, наповнити наші серця й зосередити наш погляд в епоху цифрових видовищ.",
        images: ["img/Books/Битва за увагу.jpg"],
        isHit: true
    },
    405: {
        id: 405,
        name: "Межі",
        author: "Генрі Клауд, Джон Таунсенд",
        sku: "BOK-005",
        stock: 10,
        category: "books",
        categoryName: "Книги",
        originalPrice: 420,
        discount: 0,
        rating: 4,
        image: "img/Books/Межі.jpg",
        emoji: "📖",
        bgColor: "#c5d4a5",
        description: "Чи часто вам важко сказати «ні», навіть коли ви цього хочете? Чи буває, що інші люди користуються вашою добротою, забирають ваш час, сили, енергію або гроші? \n\n Книга «Межі» допомагає зрозуміти, що здорові особисті межі — це не егоїзм, а важлива частина відповідального та збалансованого життя. Автори показують, як навчитися брати відповідальність за своє життя, правильно говорити «так» і «ні», не керуючись страхом, почуттям провини чи бажанням усім догодити. \n\n📌 Книга буде особливо корисною тим, хто:\n\nпостійно намагається всім догодити;\n\nбоїться відмовляти іншим;\n\nвідчуває провину, коли ставить власні межі;\n\nстикається з маніпуляціями та надмірними вимогами;\n\nхоче будувати здорові стосунки в сім'ї та церкві;\n\nпрагне жити відповідально перед Богом, не дозволяючи іншим керувати своїм життям. ",
        images: ["img/Books/Межі.jpg"],
        isNew: true
    },
    406: {
        id: 406,
        name: "Депресія",
        author: "Едварда Т. Велча",
        sku: "BOK-006",
        stock: 10,
        category: "books",
        categoryName: "Книги",
        originalPrice: 300,
        discount: 0,
        rating: 4,
        image: "img/Books/Депресія.jpg",
        emoji: "📖",
        bgColor: "#c5d4a5",
        description: `Депресія: бачити крізь непрооглядну темряву — книга Едварда Т. Велча для тих, хто переживає період глибокого смутку, безнадії та внутрішньої темряви.

Автор допомагає по-новому поглянути на депресію — не лише як на психологічну проблему, а й як на складний життєвий період, у якому людина потребує підтримки, надії та Божої присутності. Книга розглядає причини й прояви депресії та показує практичний шлях через біль, сумніви й відчай до відновлення.

Це не поверхнева книга з простими порадами, а мудрий і співчутливий погляд на страждання людини. Вона буде корисною як тим, хто сам проходить через темний період, так і рідним, друзям та служителям, які хочуть краще зрозуміти й підтримати близьку людину.

Книга про те, як навіть крізь найгустішу темряву побачити надію, підтримку та світло Божого Слова.`,
        
        images: ["img/Books/Депресія (1).jpg", "img/Books/Депресія (2).jpg" ,"img/Books/Депресія (3).jpg", "img/Books/Депресія (4).jpg" , "img/Books/Депресія (5).jpg"],
        isHit: true
    },
    407: {
        id: 407,
        name: "Екклезіаст. Крах сенсу",
        author: "Віктор Морла",
        sku: "BOK-007",
        stock: 5,
        category: "books",
        categoryName: "Книги",
        originalPrice: 450,
        discount: 0,
        rating: 4,
        image: "img/Books/Екклезіаст. Крах сенсу.jpg",
        emoji: "📖",
        bgColor: "#c5d4a5",
        description: `Чи може людина знайти справжній сенс життя в багатстві, успіху, задоволеннях або мудрості? Книга Екклезіаста чесно й без прикрас досліджує ці питання, показуючи, що все земне без Бога є марнотою.

Автор Віктор Морла допомагає глибше зрозуміти одну з найзагадковіших книг Біблії, розкриваючи її історичний контекст, основні теми та актуальність для сучасної людини. Це дослідження стане цінним помічником як для особистого читання, так і для вивчення Біблії в групі.

📚 Книга буде корисною для тих, хто:

прагне глибше зрозуміти книгу Екклезіаста;

шукає відповіді на питання про сенс життя;

цікавиться біблійною мудрістю та християнським світоглядом;

любить змістовну духовну літературу.


✨ «Бійся Бога та дотримуйся Його заповідей, бо в цьому все для людини» (Екклезіаста 12:13). Ця книга допоможе побачити, що справжній сенс життя відкривається лише в Господі.`,
        images: ["img/Books/Екклезіаст. Крах сенсу.jpg" , "img/Books/Екклезіаст. Крах сенсу1.jpg"],
        isNew: true
    },

    // === ІГРИ (id: 501-599) ===
    501: {
        id: 501,
        name: "Біблійна вікторина",
        sku: "GAM-001",
        stock: 14,
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
        sku: "GAM-002",
        stock: 9,
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
        sku: "CUP-001",
        stock: 30,
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
        sku: "CUP-002",
        stock: 22,
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

// ============================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================

function normalizeProduct(product) {
    if (!product || typeof product !== 'object') return null;

    const normalized = { ...product };
    normalized.id = Number(normalized.id ?? 0);
    normalized.stock = Number(normalized.stock ?? 0);
    normalized.originalPrice = Number(normalized.originalPrice ?? normalized.price ?? 0);
    normalized.discount = Number(normalized.discount ?? 0);
    normalized.rating = Number(normalized.rating ?? 5);
    normalized.category = normalized.category || '';
    normalized.categoryName = normalized.categoryName || normalized.category || '';
    normalized.name = normalized.name || 'Без назви';
    normalized.description = normalized.description || 'Опис відсутній';
    normalized.emoji = normalized.emoji || '📦';
    normalized.bgColor = normalized.bgColor || '#f2eee8';
    normalized.isHit = Boolean(normalized.isHit);
    normalized.isNew = Boolean(normalized.isNew);
    normalized.isSale = Boolean(normalized.isSale || normalized.discount > 0);
    normalized.images = Array.isArray(normalized.images) && normalized.images.length
        ? normalized.images.map((item) => resolveProductAssetUrl(item))
        : (normalized.image ? [resolveProductAssetUrl(normalized.image)] : []);
    normalized.image = normalized.image || (normalized.images[0] || '');
    normalized.author = normalized.author || '';
    normalized.sku = normalized.sku || `SKU-${normalized.id || 'new'}`;

    const sourceProduct = Number.isFinite(normalized.id) && STORE_DATA[normalized.id] ? STORE_DATA[normalized.id] : null;

    return new Proxy(normalized, {
        set(target, prop, value) {
            target[prop] = value;
            if (sourceProduct && Object.prototype.hasOwnProperty.call(sourceProduct, prop)) {
                sourceProduct[prop] = value;
            }
            return true;
        },
        get(target, prop, receiver) {
            if (sourceProduct && !(prop in target) && prop in sourceProduct) {
                return sourceProduct[prop];
            }
            const value = Reflect.get(target, prop, receiver);
            return typeof value === 'function' ? value.bind(target) : value;
        }
    });
}

function resolveProductAssetUrl(value) {
    if (!value) return '';
    const url = String(value).trim().replace(/\\/g, '/');
    if (/^(data:|https?:|\/|\.\.?\/)/.test(url)) {
      return encodeURI(url);
    }
    return `/${encodeURI(url)}`;
}

function getFinalPrice(product) {
    const safe = normalizeProduct(product) || { originalPrice: 0, discount: 0 };
    if (safe.discount && safe.discount > 0) {
        return Math.round(safe.originalPrice * (1 - safe.discount / 100));
    }
    return safe.originalPrice;
}

function getProductById(id) {
    return normalizeProduct(STORE_DATA[id] || null);
}

function getProductsByCategory(category) {
    return Object.values(STORE_DATA)
        .map(normalizeProduct)
        .filter(product => product && product.category === category);
}

function getAllProducts() {
    return Object.values(STORE_DATA).map(normalizeProduct).filter(Boolean);
}

function getStockHtml(product) {
    if (!product.stock || product.stock <= 0) {
        return '<div class="stock-badge out-of-stock">❌ Немає в наявності</div>';
    } else if (product.stock < 5) {
        return `<div class="stock-badge low-stock">⚠️ Залишилось ${product.stock} шт.</div>`;
    } else {
        return `<div class="stock-badge in-stock">✅ Є в наявності (${product.stock} шт.)</div>`;
    }
}

function getPriceHtml(product) {
    const finalPrice = getFinalPrice(product);
    if (product.discount > 0) {
        return `<span style="text-decoration:line-through; font-size:0.8rem; margin-right:6px;">${product.originalPrice} ₴</span> 
                <span style="color:#e05555; font-weight:800;">${finalPrice} ₴</span>`;
    }
    return `<span style="font-weight:800;">${finalPrice} ₴</span>`;
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

// ============================================
// ПОПУЛЯРНІ ТОВАРИ
// ============================================

const POPULAR_PRODUCTS_IDS = [101, 102, 201, 202, 401, 402, 403, 501, 502, 601, 602];

function getPopularProducts(limit = 12) {
    const popular = [];
    for (const id of POPULAR_PRODUCTS_IDS) {
        const product = getProductById(id);
        if (product && popular.length < limit) popular.push(product);
    }
    return popular;
}

window.STORE_DATA = STORE_DATA;
window.normalizeProduct = normalizeProduct;
window.getFinalPrice = getFinalPrice;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getAllProducts = getAllProducts;
window.getPopularProducts = getPopularProducts;
window.getStockHtml = getStockHtml;
window.getPriceHtml = getPriceHtml;
window.getBadgeHtml = getBadgeHtml;
window.getStarsHtml = getStarsHtml;

// ============================================
// ЕКСПОРТ
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORE_DATA,
        normalizeProduct,
        getFinalPrice,
        getProductById,
        getProductsByCategory,
        getAllProducts,
        getPopularProducts,
        getPriceHtml,
        getBadgeHtml,
        getStarsHtml,
        getStockHtml
    };
}