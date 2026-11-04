import { Router } from 'express';
import { pool } from '../db.js';
import { createInvoice } from './monobank.js';
import { notifyNewOrder } from '../services/notify.js';

const router = Router();

const clean = (v, max) => String(v ?? '').trim().slice(0, max);

function validate(body) {
  const errors = [];
  const name = clean(body.customer_name, 255);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 255);
  const address = clean(body.address, 1000);
  const method = body.payment_method;

  if (name.length < 2) errors.push('Введіть ім\'я');
  if (!/^[\d\s+()-]{10,}$/.test(phone)) errors.push('Некоректний телефон');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Некоректний email');
  if (address.length < 5) errors.push('Введіть адресу доставки');
  if (!['monobank', 'cash'].includes(method)) errors.push('Невірний спосіб оплати');

  const items = (Array.isArray(body.items) ? body.items : []).map((i) => ({
    id: Number(i.id),
    name: clean(i.name, 255),
    price: Number(i.price),
    qty: Number(i.qty),
    image: clean(i.image, 500),
  }));
  if (!items.length || items.length > 100) errors.push('Кошик порожній');
  if (items.some((i) => !Number.isInteger(i.id) || !i.name || !(i.price > 0) || !Number.isInteger(i.qty) || i.qty < 1 || i.qty > 99)) {
    errors.push('Некоректні товари в кошику');
  }
  return { errors, value: { name, phone, email, address, method, items } };
}

router.post('/create', async (req, res) => {
  const { errors, value } = validate(req.body || {});
  if (errors.length) return res.status(400).json({ message: errors.join('. '), errors });

  // Сума рахується на сервері, а не береться від клієнта
  const total = value.items.reduce((s, i) => s + i.price * i.qty, 0);

  const client = await pool.connect();
  let order;
  try {
    await client.query('BEGIN');
    order = (await client.query(
      `INSERT INTO orders (customer_name, phone, email, address, total_price, status, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [value.name, value.phone, value.email, value.address, total, value.method === 'cash' ? 'cod' : 'pending', value.method]
    )).rows[0];
    for (const i of value.items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image) VALUES ($1,$2,$3,$4,$5,$6)',
        [order.id, i.id, i.name, i.qty, i.price, i.image]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order create error:', err);
    return res.status(500).json({ message: 'Не вдалося створити замовлення' });
  } finally {
    client.release();
  }

  if (value.method === 'cash') {
    notifyNewOrder(order.id);
    return res.json({ order_id: order.id, total_price: total, phone: value.phone });
  }

  try {
    const inv = await createInvoice(order, value.items);
    await pool.query(
      "INSERT INTO payments (order_id, payment_id, amount, gateway) VALUES ($1,$2,$3,'monobank')",
      [order.id, inv.invoiceId, total]
    );
    res.json({ order_id: order.id, total_price: total, phone: value.phone, payment_url: inv.pageUrl });
  } catch (err) {
    console.error('Monobank invoice error:', err.response?.data || err.message);
    await pool.query("UPDATE orders SET status='cancelled' WHERE id=$1", [order.id]);
    res.status(502).json({ message: 'Не вдалося створити оплату. Спробуйте пізніше' });
  }
});

export default router;
