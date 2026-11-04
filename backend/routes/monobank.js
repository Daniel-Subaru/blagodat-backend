import { Router } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { pool } from '../db.js';
import { notifyNewOrder } from '../services/notify.js';

const router = Router();
const MONO_API = 'https://api.monobank.ua/api/merchant';

export async function createInvoice(order, items) {
  const { data } = await axios.post(
    `${MONO_API}/invoice/create`,
    {
      amount: Math.round(Number(order.total_price) * 100), // копійки
      ccy: 980,
      merchantPaymInfo: {
        reference: String(order.id),
        destination: `Замовлення #${order.id}`,
        basketOrder: items.map((i) => ({
          name: i.name,
          qty: i.qty,
          sum: Math.round(i.price * 100),
          code: String(i.id),
        })),
      },
      redirectUrl: `${process.env.FRONTEND_URL}/checkout.html?paid=${order.id}`,
      webHookUrl: `${process.env.PUBLIC_API_URL}/api/payment/monobank/webhook`,
    },
    { headers: { 'X-Token': process.env.MONOBANK_TOKEN } }
  );
  return data; // { invoiceId, pageUrl }
}

let cachedKey = null;
async function getPubKey() {
  if (!cachedKey) {
    const { data } = await axios.get(`${MONO_API}/pubkey`, {
      headers: { 'X-Token': process.env.MONOBANK_TOKEN },
    });
    cachedKey = Buffer.from(data.key, 'base64').toString('utf8');
  }
  return cachedKey;
}

async function verifySignature(rawBody, signature) {
  if (!signature) return false;
  const verify = crypto.createVerify('SHA256');
  verify.update(rawBody);
  return verify.verify(await getPubKey(), signature, 'base64');
}

// Webhook від Monobank. Потрібне raw-тіло (підключено в server.js)
router.post('/webhook', async (req, res) => {
  try {
    if (!(await verifySignature(req.body, req.get('X-Sign')))) {
      return res.status(403).json({ error: 'Invalid signature' });
    }
    const data = JSON.parse(req.body.toString('utf8'));
    const { invoiceId, status } = data;

    const payment = (await pool.query('SELECT * FROM payments WHERE payment_id = $1', [invoiceId])).rows[0];
    if (!payment) return res.sendStatus(200);

    if (status === 'success') {
      // Захист від повторних webhook: сповіщаємо лише при першому переході в paid
      const upd = await pool.query(
        "UPDATE payments SET status='completed', gateway_response=$2 WHERE id=$1 AND status<>'completed' RETURNING id",
        [payment.id, JSON.stringify(data)]
      );
      if (upd.rowCount) {
        await pool.query("UPDATE orders SET status='paid' WHERE id=$1", [payment.order_id]);
        notifyNewOrder(payment.order_id);
      }
    } else if (['failure', 'expired', 'reversed'].includes(status)) {
      await pool.query("UPDATE payments SET status='failed', gateway_response=$2 WHERE id=$1 AND status<>'completed'", [
        payment.id,
        JSON.stringify(data),
      ]);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Monobank webhook error:', err.message);
    res.sendStatus(500);
  }
});

export default router;
