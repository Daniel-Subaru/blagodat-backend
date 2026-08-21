import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { pool } from '../server.js';

const router = express.Router();

// ========== ПОМІЧНИКИ ==========

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не знайдений' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Невірний токен' });
    req.user = user;
    next();
  });
};

// ========== РЕЄСТРАЦІЯ (Email + Password) ==========
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }

    // Перевіримо, чи користувач вже існує
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'Користувач з таким email уже існує' });
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо користувача
    result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, auth_provider)
       VALUES ($1, $2, $3, $4, 'local')
       RETURNING id, email, first_name, last_name, created_at`,
      [email, hashedPassword, firstName || '', lastName || '']
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Користувач успішно зареєстрований',
      user,
      token
    });
  } catch (err) {
    console.error('Помилка при реєстрації:', err);
    res.status(500).json({ error: 'Помилка при реєстрації' });
  }
});

// ========== ВХІД (Email + Password) ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Невірний email або пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Невірний email або пароль' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Акаунт деактивований' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Успішний вхід',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (err) {
    console.error('Помилка при вході:', err);
    res.status(500).json({ error: 'Помилка при вході' });
  }
});

// ========== GOOGLE OAUTH ==========
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// ========== FACEBOOK OAUTH ==========
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// ========== ОТРИМАННЯ ПРОФІЛЮ (Protected) ==========
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Користувач не знайдений' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      authProvider: user.auth_provider
    });
  } catch (err) {
    console.error('Помилка при отриманні профілю:', err);
    res.status(500).json({ error: 'Помилка при отриманні профілю' });
  }
});

// ========== ОНОВЛЕННЯ ПРОФІЛЮ (Protected) ==========
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone`,
      [firstName, lastName, phone, req.user.userId]
    );

    const user = result.rows[0];
    res.json({
      message: 'Профіль оновлений',
      user
    });
  } catch (err) {
    console.error('Помилка при оновленні профілю:', err);
    res.status(500).json({ error: 'Помилка при оновленні профілю' });
  }
});

// ========== ВИХІД ==========
router.post('/logout', (req, res) => {
  res.json({ message: 'Успішний вихід' });
});

export default router;
