// ================================================
// utils/validators.js — Валідація даних
// ================================================

export function validateOrderData(data) {
  const { customer_name, phone, email, address, payment_method, items } = data;

  // Перевіра ПІБ
  if (!customer_name || customer_name.trim().length < 2) {
    return { valid: false, error: 'Невалідне ім\'я' };
  }

  // Перевіра телефону
  const phoneRegex = /^[\d\s\+\(\)\-]{10,}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return { valid: false, error: 'Невалідний номер телефону' };
  }

  // Перевіра email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Невалідна адреса email' };
  }

  // Перевіра адреси
  if (!address || address.trim().length < 5) {
    return { valid: false, error: 'Адреса занадто коротка' };
  }

  // Перевіра способу оплати
  if (!['monobank', 'privatbank', 'cash'].includes(payment_method)) {
    return { valid: false, error: 'Невалідний спосіб оплати' };
  }

  // Перевіра товарів
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Кошик порожній' };
  }

  for (const item of items) {
    if (!item.id || !item.name || !item.price || !item.qty) {
      return { valid: false, error: 'Невалідні дані товару' };
    }
    if (item.qty < 1 || isNaN(item.price)) {
      return { valid: false, error: 'Невалідна кількість або ціна' };
    }
  }

  return { valid: true };
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone) {
  const regex = /^[\d\s\+\(\)\-]{10,}$/;
  return regex.test(phone);
}
