// ============================================
// checkout.js — ЛОГІКА ОФОРМЛЕННЯ ЗАМОВЛЕННЯ
// ============================================

(function() {
  const API_BASE = 'http://localhost:3000/api';
  let cartItems = [];

  // ========== ЗАВАНТАЖЕННЯ КОШИКА ============
  function loadCart() {
    const stored = localStorage.getItem('cart');
    cartItems = stored ? JSON.parse(stored) : [];
  }

  // ========== РЕНДЕР ТАБЛИЦІ КОШИКА ============
  function renderCartTable() {
    const container = document.getElementById('cartTableContainer');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const tbody = document.getElementById('cartTableBody');
    const totalSpan = document.getElementById('checkoutTotal');

    if (!cartItems || cartItems.length === 0) {
      container.style.display = 'none';
      emptyMsg.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    emptyMsg.style.display = 'none';

    // Рендер рядків
    tbody.innerHTML = cartItems.map(item => {
      const itemTotal = item.price * item.qty;
      return `
        <tr>
          <td>
            <div class="cart-item-row">
              <div class="cart-item-thumb">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div style="background:${item.bgColor || '#ccc'}; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${item.emoji || '📦'}</div>`}
              </div>
              <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <p>${item.price} ₴</p>
              </div>
            </div>
          </td>
          <td>
            <input type="number" min="1" max="999" value="${item.qty}" class="qty-input" data-item-id="${item.id}" style="width: 60px; padding: 6px;">
          </td>
          <td>${item.price} ₴</td>
          <td style="text-align: right;">
            <strong>${formatPrice(itemTotal)}</strong>
            <br>
            <button type="button" class="btn-remove" data-item-id="${item.id}">Видалити</button>
          </td>
        </tr>
      `;
    }).join('');

    // Обробники для вводу кількості
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        const newQty = parseInt(e.target.value) || 1;
        updateQty(itemId, newQty);
      });
    });

    // Обробники видалення
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        removeItem(itemId);
      });
    });

    // Обчислення суми
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalSpan.textContent = formatPrice(total);
  }

  // ========== ОНОВЛЕННЯ КІЛЬКОСТІ ============
  function updateQty(itemId, newQty) {
    const item = cartItems.find(i => i.id == itemId);
    if (!item) return;

    const product = typeof getProductById === 'function' ? getProductById(itemId) : null;
    const previousQty = Number(item.qty) || 0;

    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }

    if (product) {
      const delta = newQty - previousQty;
      if (delta > 0) {
        const available = Number(product.stock || 0);
        if (available < delta) {
          showToast(`❌ В наявності залишилось лише ${available} шт.`);
          return;
        }
        product.stock = Math.max(0, available - delta);
      } else if (delta < 0) {
        product.stock = Math.max(0, Number(product.stock || 0) + Math.abs(delta));
      }
    }

    item.qty = newQty;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCartTable();
    showToast(`✏️ Кількість оновлена`);
  }

  // ========== ВИДАЛЕННЯ ТОВАРУ ============
  function removeItem(itemId) {
    const item = cartItems.find(i => i.id == itemId);
    if (item) {
      const product = typeof getProductById === 'function' ? getProductById(itemId) : null;
      if (product) {
        product.stock = Math.max(0, Number(product.stock || 0) + Number(item.qty || 0));
      }
      showToast(`🗑️ "${item.name}" видалено`);
    }
    cartItems = cartItems.filter(i => i.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCartTable();
  }

  // ========== ВАЛІДАЦІЯ ФОРМИ ============
  function validateForm(formData) {
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Введіть ваше ім\'я';
    }

    const phoneRegex = /^[\d\s\+\(\)\-]{10,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Введіть корректний номер';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Введіть корректний email';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      errors.address = 'Введіть адресу доставки';
    }

    if (!formData.paymentMethod) {
      errors.paymentMethod = 'Виберіть спосіб оплати';
    }

    return errors;
  }

  // ========== ПОКАЗ ПОМИЛОК ============
  function showFormErrors(errors) {
    // Очищуємо попередні помилки
    document.querySelectorAll('.form-group.error').forEach(el => {
      el.classList.remove('error');
    });

    // Показуємо нові помилки
    Object.keys(errors).forEach(fieldName => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.closest('.form-group').classList.add('error');
      }
    });
  }

  // ========== ОТПРАВКА ЗАМОВЛЕННЯ ============
  async function submitOrder(formData) {
    const submitBtn = document.getElementById('btnSubmit');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Обробляю...';

      const orderData = {
        customer_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        payment_method: formData.paymentMethod,
        items: cartItems
      };

      const response = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Помилка при створенні замовлення');
      }

      const result = await response.json();

      // Очищуємо кошик
      localStorage.removeItem('cart');
      cartItems = [];

      showToast(`✅ Замовлення створено! Номер: ${result.order_id}`, 'success');

      // Перенаправляємо на платіж
      setTimeout(() => {
        if (result.payment_url) {
          window.location.href = result.payment_url;
        } else {
          // Для готівки показуємо підтвердження
          showOrderConfirmation(result);
        }
      }, 1500);

    } catch (error) {
      console.error('Order error:', error);
      showToast(`❌ ${error.message}`, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  // ========== ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ ============
  function showOrderConfirmation(orderData) {
    const container = document.getElementById('checkoutContainer');
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 40px;">
        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
        <h2 style="font-size: 2rem; color: var(--text-primary); margin-bottom: 10px;">Замовлення прийнято!</h2>
        <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 30px;">
          Номер замовлення: <strong>#${orderData.order_id}</strong><br>
          Сума: <strong>${formatPrice(orderData.total_price)}</strong>
        </p>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          Наш менеджер скоро з вами зв'яжеться за номером ${orderData.phone}
        </p>
        <a href="index.html" class="btn btn--primary" style="display: inline-block; text-decoration: none;">← Повернутися на сайт</a>
      </div>
    `;
  }

  // ========== ФОРМАТУВАННЯ ЦІНИ ============
  function formatPrice(price) {
    return price.toLocaleString('uk-UA') + ' ₴';
  }

  // ========== TOAST ПОВІДОМЛЕННЯ ============
  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ========== ЕКРАНУВАННЯ HTML ============
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // ========== ОБРОБНИК ФОРМИ ============
  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById('fullName').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      showFormErrors(errors);
      showToast('❌ Заповніть усі поля коректно', 'error');
      return;
    }

    if (cartItems.length === 0) {
      showToast('❌ Кошик порожній', 'error');
      return;
    }

    submitOrder(formData);
  }

  // ========== ОБРОБНИКИ СПОСОБІВ ОПЛАТИ ============
  function initPaymentMethods() {
    document.querySelectorAll('.payment-option').forEach(option => {
      option.addEventListener('click', (e) => {
        if (e.target.closest('input[type="radio"]')) {
          document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
        }
      });

      // Клік на input теж
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.addEventListener('change', () => {
          document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
        });
      }
    });
  }

  // ========== ІНІТІАЛІЗАЦІЯ ============
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCartTable();
    initPaymentMethods();

    // Обробник форми
    const form = document.getElementById('checkoutForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Кнопка повернення
    const cancelBtn = document.getElementById('btnCancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    // Кнопка кошика
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  });
})();
