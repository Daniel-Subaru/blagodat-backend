/* Shared search, price slider and user-defined category filters. */
(function () {
  window.initCategorySearch = function initCategorySearch() {
    const searchInput = document.getElementById('searchInput');
    const grid = document.getElementById('productsGrid');
    if (!searchInput || !grid || searchInput.dataset.bound === 'true') return;

    searchInput.dataset.bound = 'true';
    const minInput = document.getElementById('priceMin');
    const maxInput = document.getElementById('priceMax');
    const stockInput = document.getElementById('onlyInStock');
    const slider = document.getElementById('sliderContainer');
    const sliderMin = document.getElementById('sliderMin');
    const sliderMax = document.getElementById('sliderMax');
    const sliderTrack = document.getElementById('sliderTrack');
    let cards = [];
    let bounds = { min: 0, max: 1 };

    const updateSlider = () => {
      if (!slider || !sliderMin || !sliderMax || !sliderTrack) return;
      const min = Number(minInput?.value) || bounds.min;
      const max = Number(maxInput?.value) || bounds.max;
      const span = Math.max(bounds.max - bounds.min, 1);
      const left = ((Math.min(min, max) - bounds.min) / span) * 100;
      const right = ((Math.max(min, max) - bounds.min) / span) * 100;
      sliderMin.style.left = `${left}%`;
      sliderMax.style.left = `${right}%`;
      sliderTrack.style.left = `${left}%`;
      sliderTrack.style.width = `${right - left}%`;
    };

    const ensureCategoryFilters = () => {
      const filtersGrid = document.querySelector('.filters-grid');
      if (!filtersGrid || filtersGrid.querySelector('[data-custom-categories]')) return;
      const values = [...new Map([...grid.querySelectorAll('.product-card')].map(card => {
        const value = card.dataset.category || '';
        return [value, card.querySelector('.product-card__cat')?.textContent.trim() || value];
      })).entries()];
      if (!values.length) return;
      const group = document.createElement('div');
      group.className = 'filter-group';
      group.dataset.customCategories = 'true';
      group.innerHTML = `<div class="filter-label">🏷️ Категорії</div><div class="filter-checkboxes">${values.map(([value, label]) =>
        `<label class="filter-checkbox"><input type="checkbox" data-category-filter value="${value}"><span>${label}</span></label>`).join('')}</div>`;
      filtersGrid.appendChild(group);
      group.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
        input.closest('.filter-checkbox')?.classList.toggle('active', input.checked);
        update();
      }));
    };

    const update = () => {
      cards = [...grid.querySelectorAll('.product-card')];
      ensureCategoryFilters();
      const term = searchInput.value.trim().toLowerCase();
      const min = Number(minInput?.value);
      const max = Number(maxInput?.value);
      const selected = [...document.querySelectorAll('.filter-checkbox input:not(#onlyInStock):checked')]
        .map(input => input.value.toLowerCase());
      let visible = 0;
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const price = Number(card.dataset.price);
        const inStock = !card.querySelector('.out-of-stock');
        const category = (card.dataset.category || '').toLowerCase();
        const matches = (!term || text.includes(term))
          && (Number.isNaN(min) || price >= min)
          && (Number.isNaN(max) || price <= max)
          && (!stockInput?.checked || inStock)
          && (!selected.length || selected.includes(category) || selected.some(value => text.includes(value)));
        card.classList.toggle('hidden', !matches);
        if (matches) visible++;
      });
      document.getElementById('resultsCount')?.replaceChildren(String(visible));
      document.getElementById('totalCount')?.replaceChildren(String(cards.length));
      const clear = document.getElementById('clearSearch');
      if (clear) clear.style.display = term ? 'flex' : 'none';
      updateSlider();
    };

    const refreshBounds = () => {
      const prices = [...grid.querySelectorAll('.product-card')]
        .map(card => Number(card.dataset.price)).filter(Number.isFinite);
      if (!prices.length) return;
      bounds = { min: Math.min(...prices), max: Math.max(...prices) || Math.min(...prices) + 1 };
    };

    const setFromPointer = (event, handle) => {
      if (!slider) return;
      const rect = slider.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const value = Math.round(bounds.min + ratio * (bounds.max - bounds.min));
      if (handle === 'min' && minInput) minInput.value = String(Math.min(value, Number(maxInput?.value) || bounds.max));
      if (handle === 'max' && maxInput) maxInput.value = String(Math.max(value, Number(minInput?.value) || bounds.min));
      update();
    };
    [ ['min', sliderMin], ['max', sliderMax] ].forEach(([handle, element]) => {
      element?.addEventListener('pointerdown', event => {
        event.preventDefault();
        element.setPointerCapture?.(event.pointerId);
        const move = e => setFromPointer(e, handle);
        const stop = () => {
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerup', stop);
        };
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerup', stop, { once: true });
      });
    });

    const prices = [...grid.querySelectorAll('.product-card')].map(card => Number(card.dataset.price)).filter(Number.isFinite);
    if (prices.length) {
      bounds = { min: Math.min(...prices), max: Math.max(...prices) || Math.min(...prices) + 1 };
      if (minInput) minInput.value = String(bounds.min);
      if (maxInput) maxInput.value = String(bounds.max);
    }
    searchInput.addEventListener('input', update);
    document.getElementById('clearSearch')?.addEventListener('click', () => { searchInput.value = ''; update(); searchInput.focus(); });
    document.getElementById('applyFilters')?.addEventListener('click', update);
    document.getElementById('resetFilters')?.addEventListener('click', () => {
      searchInput.value = '';
      refreshBounds();
      if (minInput) minInput.value = String(bounds.min);
      if (maxInput) maxInput.value = String(bounds.max);
      if (stockInput) stockInput.checked = false;
      document.querySelectorAll('.filter-checkbox input').forEach(input => { input.checked = false; input.closest('.filter-checkbox')?.classList.remove('active'); });
      update();
    });
    document.querySelectorAll('.filter-checkbox input').forEach(input => input.addEventListener('change', () => {
      input.closest('.filter-checkbox')?.classList.toggle('active', input.checked);
      update();
    }));
    new MutationObserver(update).observe(grid, { childList: true });
    update();
  };
})();
