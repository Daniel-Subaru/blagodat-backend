/* =============================================
   ПОШУК ТА ФІЛЬТРАЦІЯ ДЛЯ СТОРІНОК КАТЕГОРІЙ
   - Фільтрація карток товарів за текстом
   - Лічильник знайдених товарів
   - Кнопка очищення пошуку
============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const resultsCountSpan = document.getElementById('resultsCount');
  const productsGrid = document.querySelector('.products__grid');
  
  if (!searchInput || !productsGrid) return;
  
  let allProductCards = Array.from(document.querySelectorAll('.product-card'));
  let debounceTimer;
  
  // Оновлення лічильника
  function updateResultsCount(visibleCount, totalCount) {
    if (resultsCountSpan) {
      resultsCountSpan.textContent = visibleCount;
      const totalSpan = document.getElementById('totalCount');
      if (totalSpan) totalSpan.textContent = totalCount;
    }
    
    // Показати/сховати повідомлення "Нічого не знайдено"
    let noResultsDiv = document.querySelector('.no-results');
    if (!noResultsDiv && productsGrid) {
      noResultsDiv = document.createElement('div');
      noResultsDiv.className = 'no-results hidden';
      noResultsDiv.innerHTML = '😔 За вашим запитом нічого не знайдено<br><small>Спробуйте інші ключові слова</small>';
      productsGrid.parentNode.insertBefore(noResultsDiv, productsGrid.nextSibling);
    }
    
    if (noResultsDiv) {
      if (visibleCount === 0 && allProductCards.length > 0) {
        noResultsDiv.classList.remove('hidden');
      } else {
        noResultsDiv.classList.add('hidden');
      }
    }
  }
  
  // Фільтрація карток
  function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    let visibleCount = 0;
    
    allProductCards.forEach((card, index) => {
      const productName = card.querySelector('.product-card__name')?.textContent?.trim().toLowerCase() || '';
      const productCat = card.querySelector('.product-card__cat')?.textContent?.trim().toLowerCase() || '';
      const matches = searchTerm === '' || productName.includes(searchTerm) || productCat.includes(searchTerm);
      
      if (matches) {
        card.classList.remove('hidden');
        // Додаємо анімацію появи для відфільтрованих
        if (searchTerm !== '') {
          card.classList.add('search-match');
          setTimeout(() => card.classList.remove('search-match'), 500);
        }
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    
    updateResultsCount(visibleCount, allProductCards.length);
    
    // Показати/сховати кнопку очищення
    if (clearBtn) {
      clearBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
    }
  }
  
  // Обробник вводу з debounce
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filterProducts, 300);
  });
  
  // Кнопка очищення
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterProducts();
      searchInput.focus();
    });
  }
  
  // Оновлюємо список карток при динамічних змінах (наприклад, після додавання в кошик - не впливає)
  const observer = new MutationObserver(() => {
    allProductCards = Array.from(document.querySelectorAll('.product-card'));
    filterProducts(); // перефільтрувати після можливих змін
  });
  observer.observe(productsGrid, { childList: true, subtree: false });
  
  // Початковий підрахунок
  updateResultsCount(allProductCards.length, allProductCards.length);
  
  // Додаємо лічильник загальної кількості в HTML, якщо його немає
  const totalSpan = document.getElementById('totalCount');
  if (totalSpan) totalSpan.textContent = allProductCards.length;
});