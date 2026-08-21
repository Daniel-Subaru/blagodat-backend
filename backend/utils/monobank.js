// ================================================
// utils/monobank.js — Інтеграція з Monobank
// ================================================

import axios from 'axios';

const MONOBANK_API = process.env.MONOBANK_API || 'https://api.monobank.ua';
const MONOBANK_TOKEN = process.env.MONOBANK_TOKEN;

/**
 * Створити інвойс у Monobank
 * @param {Object} data - { orderId, amount (копійки), customerName, customerEmail, customerPhone }
 * @returns {Object} { invoiceId, pageUrl }
 */
export async function createMonobankInvoice(data) {
  if (!MONOBANK_TOKEN) {
    throw new Error('MONOBANK_TOKEN не налаштований');
  }

  try {
    const response = await axios.post(
      `${MONOBANK_API}/api/merchant/invoice/create`,
      {
        amount: data.amount, // копійки
        ccy: 'UAH',
        merchantPaymInfo: {
          reference: `order-${data.orderId}`,
          destination: `Замовлення №${data.orderId}`
        },
        redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout.html?order=${data.orderId}&status=success`,
        webHookUrl: `${process.env.API_URL || 'http://localhost:3000'}/api/payment/monobank/webhook`
      },
      {
        headers: {
          'X-Token': MONOBANK_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      invoiceId: response.data.invoiceId,
      pageUrl: response.data.pageUrl
    };
  } catch (error) {
    console.error('Monobank API error:', error.response?.data || error.message);
    throw new Error('Помилка при створенні інвойсу: ' + (error.response?.data?.description || error.message));
  }
}

/**
 * Перевірити статус платежу
 * @param {string} invoiceId - ID інвойсу від Monobank
 * @returns {Object} { status, amount, ccy }
 */
export async function getMonobankInvoiceStatus(invoiceId) {
  if (!MONOBANK_TOKEN) {
    throw new Error('MONOBANK_TOKEN не налаштований');
  }

  try {
    const response = await axios.get(
      `${MONOBANK_API}/api/merchant/invoice/status?invoiceId=${invoiceId}`,
      {
        headers: {
          'X-Token': MONOBANK_TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Monobank status error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Парсити webhook від Monobank
 * @param {string} signature - X-Sign header
 * @param {Buffer} body - Raw body
 * @returns {Object} Декодовані дані або null
 */
export function verifyMonobankWebhook(signature, body) {
  // TODO: Реалізувати перевірку підпису
  // Документація: https://docs.monobank.ua/docs/acquiring/intro
  return JSON.parse(body.toString());
}
