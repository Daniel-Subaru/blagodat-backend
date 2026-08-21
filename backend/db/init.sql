-- ================================================
-- PostgreSQL Schema для Благодать Крамниця
-- Запустити: psql -U postgres -f db/init.sql
-- ================================================

-- Видалити існуючі таблиці (якщо є)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ================================================
-- ТАБЛИЦЯ КОРИСТУВАЧІВ
-- ================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- NULL для OAuth користувачів
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  auth_provider VARCHAR(50) DEFAULT 'local', -- local, google, facebook
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_facebook_id ON users(facebook_id);

-- ================================================
-- ТАБЛИЦЯ ЗАМОВЛЕНЬ
-- ================================================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled
  payment_method VARCHAR(50) NOT NULL, -- monobank, privatbank, cash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ================================================
-- ТАБЛИЦЯ ТОВАРІВ В ЗАМОВЛЕННІ
-- ================================================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ================================================
-- ТАБЛИЦЯ ПЛАТЕЖІВ
-- ================================================
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) UNIQUE, -- ID від платіжної системи
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
  amount DECIMAL(10, 2) NOT NULL,
  gateway VARCHAR(50) NOT NULL, -- monobank, privatbank
  gateway_response TEXT, -- Raw response від платіжної системи
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway);

-- ================================================
-- ТРИГЕР: Оновлення updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ПРИКЛАД ДАНИХ
-- ================================================
-- INSERT INTO orders (customer_name, phone, email, address, total_price, status, payment_method)
-- VALUES ('Іван Петренко', '+380951234567', 'ivan@mail.com', 'м. Івано-Франківськ, вул. Тестова, 1', 1299.00, 'pending', 'monobank');

-- SELECT * FROM orders;
-- SELECT * FROM order_items;
-- SELECT * FROM payments;
