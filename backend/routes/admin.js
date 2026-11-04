import { Router } from 'express';
import ExcelJS from 'exceljs';
import { pool } from '../db.js';

const router = Router();

// Доступ за ключем: /api/admin/orders.xlsx?key=ADMIN_KEY (або заголовок x-admin-key)
router.use((req, res, next) => {
  const key = req.get('x-admin-key') || req.query.key;
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Excel: один рядок на товар, щоб було видно що пакувати
router.get('/orders.xlsx', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.id, o.created_at, o.status, o.payment_method, o.customer_name, o.phone, o.email, o.address,
           o.total_price, i.product_id, i.product_name, i.quantity, i.price
    FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
    WHERE o.status <> 'cancelled'
    ORDER BY o.created_at DESC, o.id DESC, i.id`);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Замовлення');
  ws.columns = [
    { header: '№', key: 'id', width: 8 },
    { header: 'Дата', key: 'created_at', width: 20 },
    { header: 'Статус', key: 'status', width: 12 },
    { header: 'Оплата', key: 'payment_method', width: 12 },
    { header: 'Товар', key: 'product_name', width: 40 },
    { header: 'К-сть', key: 'quantity', width: 8 },
    { header: 'Ціна', key: 'price', width: 10 },
    { header: 'Сума замовлення', key: 'total_price', width: 16 },
    { header: 'Клієнт', key: 'customer_name', width: 24 },
    { header: 'Телефон', key: 'phone', width: 18 },
    { header: 'Email', key: 'email', width: 26 },
    { header: 'Адреса', key: 'address', width: 40 },
  ];
  ws.getRow(1).font = { bold: true };
  rows.forEach((r) => ws.addRow({ ...r, price: Number(r.price), total_price: Number(r.total_price) }));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.xlsx"');
  await wb.xlsx.write(res);
  res.end();
});

router.get('/orders', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.*, COALESCE(json_agg(json_build_object('name', i.product_name, 'qty', i.quantity, 'price', i.price))
           FILTER (WHERE i.id IS NOT NULL), '[]') AS items
    FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
    GROUP BY o.id ORDER BY o.created_at DESC LIMIT 200`);
  res.json(rows);
});

router.patch('/orders/:id/status', async (req, res) => {
  const allowed = ['pending', 'paid', 'cod', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ error: 'Invalid status' });
  await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [req.body.status, req.params.id]);
  res.json({ ok: true });
});

export default router;
