// ================================================
// server.js — Express сервер для Благодать Крамниця
// ================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ========== SESSION & PASSPORT ==========
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// ========== DATABASE CONNECTION ==========
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'blagodat_shop',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Тестування з'єднання з БД
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected:', result.rows[0].now);
  }
});

// ========== ROUTES ==========

// Здоровлення
app.get('/', (req, res) => {
  res.json({
    message: 'Благодать Крамниця API',
    version: '1.0.0',
    status: 'running'
  });
});

// Import routes
import ordersRouter from './routes/orders.js';
import monobankRouter from './routes/monobank.js';
import privatbankRouter from './routes/privatbank.js';
import authRouter from './routes/auth.js';

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payment/monobank', monobankRouter);
app.use('/api/payment/privatbank', privatbankRouter);

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Database: ${process.env.DB_NAME}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
