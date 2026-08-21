// ================================================
// routes/privatbank.js — Інтеграція PrivatBank
// ================================================

import express from 'express';
import { pool } from '../server.js';

const router = express.Router();

// ========== POST /api/payment/privatbank/webhook ==========
// Webhook від PrivatBank при платежі
router.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('PrivatBank webhook received:', data);

    // TODO: Реалізувати PrivatBank webhook обробку
    // https://privatbank.ua/ua/business/internet-acquiring/documentation

    res.json({ success: true, status: 'not_implemented_yet' });
  } catch (error) {
    console.error('PrivatBank webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
