// ================================================
// routes/monobank.js — Webhook для Monobank
// ================================================

import express from 'express';
import { pool } from '../server.js';
import { getMonobankInvoiceStatus } from '../utils/monobank.js';

const router = express.Router();

// ========== POST /api/payment/monobank/webhook ==========
// Webhook від Monobank при платежі
router.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('Monobank webhook received:', data);

    // TODO: Перевірити підпис (X-Sign header)

    if (data.status === 'success' && data.invoiceId) {
      // Оновити статус замовлення
      const result = await pool.query(
        `SELECT o.id FROM orders o
         JOIN payments p ON o.id = p.order_id
         WHERE p.payment_id = $1`,
        [data.invoiceId]
      );

      if (result.rows.length > 0) {
        const orderId = result.rows[0].id;

        await pool.query(
          `UPDATE orders SET status = $1 WHERE id = $2`,
          ['paid', orderId]
        );

        await pool.query(
          `UPDATE payments SET status = $1, gateway_response = $2 WHERE payment_id = $3`,
          ['completed', JSON.stringify(data), data.invoiceId]
        );

        console.log(`✅ Order ${orderId} marked as paid`);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ========== GET /api/payment/monobank/status/:invoiceId ==========
// Отримати статус платежу
router.get('/status/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const status = await getMonobankInvoiceStatus(invoiceId);

    // Оновити БД
    const result = await pool.query(
      `SELECT o.id FROM orders o
       JOIN payments p ON o.id = p.order_id
       WHERE p.payment_id = $1`,
      [invoiceId]
    );

    if (result.rows.length > 0 && status.status === 'success') {
      await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2`,
        ['paid', result.rows[0].id]
      );
    }

    res.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Status check failed' });
  }
});

export default router;
