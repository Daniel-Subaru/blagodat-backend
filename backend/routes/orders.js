// ================================================
// routes/orders.js — API для замовлень
// ================================================

import express from 'express';
import { pool } from '../server.js';
import { validateOrderData } from '../utils/validators.js';
import { createMonobankInvoice } from '../utils/monobank.js';

const router = express.Router();

// ========== POST /api/orders/create ==========
// Створити нове замовлення
router.post('/create', async (req, res) => {
  const client = await pool.connect();

  try {
    const { customer_name, phone, email, address, payment_method, items } = req.body;

    // Валідація
    const validation = validateOrderData({ customer_name, phone, email, address, payment_method, items });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Обчислення суми
    const total_price = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    await client.query('BEGIN');

    // 1. Створити замовлення
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, phone, email, address, total_price, status, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at;`,
      [customer_name, phone, email, address, total_price, 'pending', payment_method]
    );

    const orderId = orderResult.rows[0].id;

    // 2. Додати товари в замовлення
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [orderId, item.id, item.name, item.qty, item.price, item.image || null]
      );
    }

    await client.query('COMMIT');

    // 3. Генерувати посилання на платіж (залежить від способу оплати)
    let paymentUrl = null;

    if (payment_method === 'monobank') {
      try {
        const invoiceData = await createMonobankInvoice({
          orderId,
          amount: Math.round(total_price * 100), // копійки
          customerName: customer_name,
          customerEmail: email,
          customerPhone: phone
        });
        paymentUrl = invoiceData.pageUrl;

        // Зберегти платіж
        await pool.query(
          `INSERT INTO payments (order_id, payment_id, status, amount, gateway)
           VALUES ($1, $2, $3, $4, $5);`,
          [orderId, invoiceData.invoiceId, 'pending', total_price, 'monobank']
        );
      } catch (err) {
        console.error('Monobank error:', err);
        // Продовжуємо, але без посилання
      }
    } else if (payment_method === 'privatbank') {
      // TODO: Реалізувати PrivatBank
      console.log('PrivatBank payment coming soon');
    } else if (payment_method === 'cash') {
      // Для готівки платіж не потрібен
      await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2;`,
        ['pending_payment', orderId]
      );
    }

    res.json({
      success: true,
      order_id: orderId,
      total_price,
      payment_method,
      payment_url: paymentUrl,
      message: `Замовлення №${orderId} успішно створено`
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Помилка при створенні замовлення', details: error.message });
  } finally {
    client.release();
  }
});

// ========== GET /api/orders/:id ==========
// Отримати замовлення
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Помилка при отримані замовлення' });
  }
});

// ========== GET /api/orders ==========
// Список усіх замовлень (для адмініста)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100'
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Помилка при отримані замовлень' });
  }
});

export default router;
