import axios from 'axios';
import { pool } from '../db.js';

export async function getOrderWithItems(orderId) {
  const order = (await pool.query('SELECT * FROM orders WHERE id = $1', [orderId])).rows[0];
  if (!order) return null;
  order.items = (await pool.query(
    'SELECT product_id, product_name, quantity, price FROM order_items WHERE order_id = $1 ORDER BY id',
    [orderId]
  )).rows;
  return order;
}

// Повідомлення власнику в Telegram: що замовили і що пакувати
export async function notifyNewOrder(orderId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('Telegram не налаштовано (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)');
    return;
  }
  try {
    const o = await getOrderWithItems(orderId);
    if (!o) return;
    const status = o.status === 'paid' ? '✅ ОПЛАЧЕНО (Monobank)' : '💰 Оплата при отриманні';
    const items = o.items
      .map((i) => `• ${i.product_name} × ${i.quantity} (${i.price} ₴)`)
      .join('\n');
    const text =
      `🛒 Нове замовлення #${o.id}\n${status}\n\n` +
      `📦 Пакувати:\n${items}\n\n` +
      `💵 Сума: ${o.total_price} ₴\n` +
      `👤 ${o.customer_name}\n📞 ${o.phone}\n✉️ ${o.email}\n📍 ${o.address}`;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text });
  } catch (err) {
    console.error('Telegram notify failed:', err.message);
  }
}
