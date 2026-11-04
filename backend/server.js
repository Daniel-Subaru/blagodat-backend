// Express сервер для Благодать Крамниця
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import ordersRouter from './routes/orders.js';
import monobankRouter from './routes/monobank.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5500')
    .split(',')
    .concat(['http://127.0.0.1:5500', 'http://localhost:5500']),
}));

// Monobank webhook потребує raw-тіла для перевірки підпису
app.use('/api/payment/monobank/webhook', express.raw({ type: '*/*', limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ message: 'Благодать Крамниця API', status: 'running' }));

app.use('/api/orders', ordersRouter);
app.use('/api/payment/monobank', monobankRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

pool.query('SELECT NOW()')
  .then((r) => console.log('✅ Database connected:', r.rows[0].now))
  .catch((e) => console.error('❌ Database connection failed:', e.message));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
