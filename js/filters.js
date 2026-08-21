// ============================================
// filters.js — ЛОГІКА ФІЛЬТРІВ ДЛЯ КАТЕГОРІЙ
// Підтримує: ціновий слайдер, дитяча література, переклади
// ============================================

(function() {
    // Стан фільтрів
    let filtersState = {
        priceMin: 0,
        priceMax: 5000,
        children: false,
        translations: []  // cuv, ogienko, turkonjak, modern
    };
    
    let globalMinPrice = 0;
    let globalMaxPrice = 5000;
    
    // DOM елементи
    let priceMinInput, priceMaxInput, sliderMin, sliderMax, sliderTrack;
    let applyBtn, resetBtn;
    let childrenCheckbox;
    let translationCheckboxes;
    
    // Активний слайдер для drag
    let activeSlider = null;
    
    // ========== ІНІЦІАЛІЗАЦІЯ ==========
    function initFilters() {
        // Отримуємо елементи
        priceMinInput = document.getElementById('priceMin');
        priceMaxInput = document.getElementById('priceMax');
        sliderMin = document.getElementById('sliderMin');
        sliderMax = document.getElementById('sliderMax');
        sliderTrack = document.getElementById('sliderTrack');
        applyBtn = document.getElementById('applyFilters');
        resetBtn = document.getElementById('resetFilters');
        
        if (!priceMinInput) return; // Виходимо, якщо фільтрів немає на сторінці
        
        // Фільтр "Дитяча література"
        childrenCheckbox = document.querySelector('.filter-checkbox[data-filter="children"] input');
        
        // Фільтр перекладів
        translationCheckboxes = document.querySelectorAll('#translationsFilter input');
        
        // Оновлюємо діапазон цін з товарів
        updatePriceRange();
        
        // Ініціалізуємо слайдер
        initSlider();
        
        // Ініціалізуємо стилі чекбоксів
        initCheckboxStyles();
        
        // Додаємо обробники подій
        bindEvents();
    }
    
    // ========== ОНОВЛЕННЯ ДІАПАЗОНУ ЦІН ==========
    function updatePriceRange() {
        const cards = document.querySelectorAll('.product-card');
        let prices = [];
        
        cards.forEach(card => {
            const price = parseInt(card.dataset.price);
            if (!isNaN(price)) prices.push(price);
        });
        
        if (prices.length > 0) {
            globalMinPrice = Math.min(...prices);
            globalMaxPrice = Math.max(...prices);
            filtersState.priceMin = globalMinPrice;
            filtersState.priceMax = globalMaxPrice;
            
            if (priceMinInput) priceMinInput.value = filtersState.priceMin;
            if (priceMaxInput) priceMaxInput.value = filtersState.priceMax;
            if (priceMinInput) priceMinInput.placeholder = globalMinPrice;
            if (priceMaxInput) priceMaxInput.placeholder = globalMaxPrice;
        }
        
        updateSliderUI();
    }
    
    // ========== ОНОВЛЕННЯ СЛАЙДЕРА ==========
    function updateSliderUI() {
        if (!sliderMin || !sliderMax || !sliderTrack) return;
        
        const range = globalMaxPrice - globalMinPrice;
        const percentMin = ((filtersState.priceMin - globalMinPrice) / range) * 100;
        const percentMax = ((filtersState.priceMax - globalMinPrice) / range) * 100;
        
        sliderMin.style.left = `${percentMin}%`;
        sliderMax.style.left = `${percentMax}%`;
        sliderTrack.style.left = `${percentMin}%`;
        sliderTrack.style.width = `${percentMax - percentMin}%`;
    }
    
    // ========== ІНІЦІАЛІЗАЦІЯ СЛАЙДЕРА ==========
    function initSlider() {
        if (!sliderMin || !sliderMax) return;
        
        sliderMin.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeSlider = 'min';
            document.addEventListener('mousemove', onSliderDrag);
            document.addEventListener('mouseup', stopSliderDrag);
        });
        
        sliderMax.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeSlider = 'max';
            document.addEventListener('mousemove', onSliderDrag);
            document.addEventListener('mouseup', stopSliderDrag);
        });
    }
    
    function onSliderDrag(e) {
        if (!activeSlider) return;
        
        const container = document.getElementById('sliderContainer');
        const rect = container.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.min(Math.max(percent, 0), 1);
        
        let price = globalMinPrice + percent * (globalMaxPrice - globalMinPrice);
        price = Math.round(price);
        
        if (activeSlider === 'min') {
            filtersState.priceMin = Math.min(price, filtersState.priceMax);
            if (priceMinInput) priceMinInput.value = filtersState.priceMin;
        } else if (activeSlider === 'max') {
            filtersState.priceMax = Math.max(price, filtersState.priceMin);
            if (priceMaxInput) priceMaxInput.value = filtersState.priceMax;
        }
        
        updateSliderUI();
    }
    
    function stopSliderDrag() {
        activeSlider = null;
        document.removeEventListener('mousemove', onSliderDrag);
        document.removeEventListener('mouseup', stopSliderDrag);
    }
    
    // ========== ІНІЦІАЛІЗАЦІЯ СТИЛІВ ЧЕКБОКСІВ ==========
    function initCheckboxStyles() {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            const input = checkbox.querySelector('input');
            if (!input) return;
            
            // Встановлюємо початковий стан
            if (input.checked) {
                checkbox.classList.add('active');
            } else {
                checkbox.classList.remove('active');
            }
            
            input.addEventListener('change', function() {
                if (this.checked) {
                    checkbox.classList.add('active');
                } else {
                    checkbox.classList.remove('active');
                }
            });
        });
    }
    
    // ========== ОТРИМАННЯ АКТИВНИХ ФІЛЬТРІВ ==========
    function getActiveFilters() {
        // Ціна
        if (priceMinInput) filtersState.priceMin = parseInt(priceMinInput.value) || globalMinPrice;
        if (priceMaxInput) filtersState.priceMax = parseInt(priceMaxInput.value) || globalMaxPrice;
        
        // Корекція
        filtersState.priceMin = Math.min(Math.max(filtersState.priceMin, globalMinPrice), filtersState.priceMax);
        filtersState.priceMax = Math.max(Math.min(filtersState.priceMax, globalMaxPrice), filtersState.priceMin);
        
        // Дитяча література
        filtersState.children = childrenCheckbox ? childrenCheckbox.checked : false;
        
        // Переклади
        filtersState.translations = [];
        if (translationCheckboxes) {
            translationCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    filtersState.translations.push(checkbox.value);
                }
            });
        }
        
        return filtersState;
    }
    
    // ========== ЗАСТОСУВАННЯ ФІЛЬТРІВ ==========
    function applyFilters() {
        const filters = getActiveFilters();
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const price = parseInt(card.dataset.price);
            const name = card.querySelector('.product-card__name')?.textContent?.toLowerCase() || '';
            let show = true;
            
            // Фільтр за ціною
            if (price < filters.priceMin || price > filters.priceMax) {
                show = false;
            }
            
            // Фільтр "Дитяча література"
            if (show && filters.children) {
                const isChildren = name.includes('дитяча') || name.includes('дитя') || name.includes('для дітей');
                if (!isChildren) show = false;
            }
            
            // Фільтр за перекладами
            if (show && filters.translations.length > 0) {
                let hasTranslation = false;
                filters.translations.forEach(trans => {
                    switch(trans) {
                        case 'cuv':
                            if (name.includes('cuv') || name.includes('китайсько')) hasTranslation = true;
                            break;
                        case 'ogienko':
                            if (name.includes('огієнка')) hasTranslation = true;
                            break;
                        case 'turkonjak':
                            if (name.includes('турконяка')) hasTranslation = true;
                            break;
                        case 'modern':
                            if (name.includes('сучасний') || name.includes('сучасного')) hasTranslation = true;
                            break;
                    }
                });
                if (!hasTranslation) show = false;
            }
            
            card.classList.toggle('hidden', !show);
            if (show) visibleCount++;
        });
        
        // Оновлюємо лічильник
        updateResultsCount(visibleCount);
        
        // Показуємо повідомлення "нічого не знайдено"
        showNoResultsMessage(visibleCount === 0);
    }
    
    // ========== ОНОВЛЕННЯ ЛІЧИЛЬНИКА ==========
    function updateResultsCount(visibleCount) {
        const resultsSpan = document.getElementById('resultsCount');
        const totalSpan = document.getElementById('totalCount');
        const cards = document.querySelectorAll('.product-card');
        
        if (resultsSpan) resultsSpan.textContent = visibleCount;
        if (totalSpan && totalSpan.textContent !== String(cards.length)) {
            totalSpan.textContent = cards.length;
        }
    }
    
    // ========== ПОВІДОМЛЕННЯ "НІЧОГО НЕ ЗНАЙДЕНО" ==========
    let noResultsDiv = null;
    
    function showNoResultsMessage(show) {
        if (!noResultsDiv) {
            const productsGrid = document.querySelector('.products__grid');
            if (productsGrid && productsGrid.parentNode) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results-message search-no-results';
                noResultsDiv.innerHTML = '😔 За вибраними фільтрами нічого не знайдено';
                noResultsDiv.style.display = 'none';
                productsGrid.parentNode.insertBefore(noResultsDiv, productsGrid.nextSibling);
            }
        }
        
        if (noResultsDiv) {
            noResultsDiv.style.display = show ? 'block' : 'none';
        }
    }
    
    // ========== СКИДАННЯ ФІЛЬТРІВ ==========
    function resetFilters() {
        // Скидаємо ціни
        filtersState.priceMin = globalMinPrice;
        filtersState.priceMax = globalMaxPrice;
        if (priceMinInput) priceMinInput.value = filtersState.priceMin;
        if (priceMaxInput) priceMaxInput.value = filtersState.priceMax;
        updateSliderUI();
        
        // Скидаємо "Дитяча література"
        if (childrenCheckbox) {
            childrenCheckbox.checked = false;
            const parent = childrenCheckbox.closest('.filter-checkbox');
            if (parent) parent.classList.remove('active');
        }
        
        // Скидаємо переклади
        if (translationCheckboxes) {
            translationCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                const parent = checkbox.closest('.filter-checkbox');
                if (parent) parent.classList.remove('active');
            });
        }
        
        filtersState.translations = [];
        filtersState.children = false;
        
        // Застосовуємо скинуті фільтри
        applyFilters();
    }
    
    // ========== ОБРОБНИКИ ПОДІЙ ==========
    function bindEvents() {
        // Ручне введення ціни
        if (priceMinInput) {
            priceMinInput.addEventListener('change', () => {
                let val = parseInt(priceMinInput.value);
                if (isNaN(val)) val = globalMinPrice;
                filtersState.priceMin = Math.min(Math.max(val, globalMinPrice), filtersState.priceMax);
                priceMinInput.value = filtersState.priceMin;
                updateSliderUI();
            });
        }
        
        if (priceMaxInput) {
            priceMaxInput.addEventListener('change', () => {
                let val = parseInt(priceMaxInput.value);
                if (isNaN(val)) val = globalMaxPrice;
                filtersState.priceMax = Math.max(Math.min(val, globalMaxPrice), filtersState.priceMin);
                priceMaxInput.value = filtersState.priceMax;
                updateSliderUI();
            });
        }
        
        // Кнопка "Застосувати"
        if (applyBtn) {
            applyBtn.addEventListener('click', applyFilters);
        }
        
        // Кнопка "Скинути"
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
    }
    
    // ========== ПУБЛІЧНІ МЕТОДИ ==========
    window.filtersAPI = {
        init: initFilters,
        apply: applyFilters,
        reset: resetFilters,
        updatePriceRange: updatePriceRange
    };
    
    // Автоматична ініціалізація після завантаження DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Невелика затримка, щоб товари відрендерились
        setTimeout(() => {
            initFilters();
        }, 300);
    });
})();