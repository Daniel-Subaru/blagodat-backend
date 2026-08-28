/* Shared search and filter behavior for category pages. */
(function () {
  window.initCategorySearch = function initCategorySearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const productsGrid = document.querySelector('.products__grid');
    if (!searchInput || !productsGrid || searchInput.dataset.bound === 'true') return;

    searchInput.dataset.bound = 'true';
    const resultsCount = document.getElementById('resultsCount');
    let cards = Array.from(productsGrid.querySelectorAll('.product-card'));
    let timer;

    const update = () => {
      cards = Array.from(productsGrid.querySelectorAll('.product-card'));
      const term = searchInput.value.trim().toLowerCase();
      const min = parseInt(document.getElementById('priceMin')?.value, 10);
      const max = parseInt(document.getElementById('priceMax')?.value, 10);
      const onlyInStock = document.getElementById('onlyInStock')?.checked || false;
      let visible = 0;

      cards.forEach(card => {
        const name = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.product-card__cat')?.textContent.toLowerCase() || '';
        const price = parseInt(card.dataset.price, 10);
        const inStock = !card.querySelector('.stock-badge.out-of-stock');
        const matches = (!term || name.includes(term) || category.includes(term))
          && (Number.isNaN(min) || price >= min)
          && (Number.isNaN(max) || price <= max)
          && (!onlyInStock || inStock);
        card.classList.toggle('hidden', !matches);
        if (matches) visible++;
      });

      if (resultsCount) resultsCount.textContent = visible;
      const total = document.getElementById('totalCount');
      if (total) total.textContent = cards.length;
      if (clearBtn) clearBtn.style.display = term ? 'flex' : 'none';
    };

    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(update, 200);
    });
    clearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      update();
      searchInput.focus();
    });
    document.getElementById('applyFilters')?.addEventListener('click', update);
    document.getElementById('resetFilters')?.addEventListener('click', () => {
      searchInput.value = '';
      const min = document.getElementById('priceMin');
      const max = document.getElementById('priceMax');
      if (min) min.value = '';
      if (max) max.value = '';
      const stock = document.getElementById('onlyInStock');
      if (stock) stock.checked = false;
      update();
    });

    new MutationObserver(update).observe(productsGrid, { childList: true });
    update();
  };
})();
