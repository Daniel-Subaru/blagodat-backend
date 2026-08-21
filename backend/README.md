# 🚀 Благодать Крамниця — Backend Setup Guide

## 📋 Структура Backend

```
backend/
├── server.js              ✅ Express сервер
├── package.json           ✅ Dependencies
├── .env                   ✅ Конфігурація (шаблон)
├── .gitignore             ✅ Git ignore
├── routes/
│   ├── orders.js          ✅ API замовлень
│   ├── monobank.js        ✅ Monobank webhook
<!--│   └── privatbank.js      ✅ PrivatBank (заготовка)-->
├── utils/
│   ├── validators.js      ✅ Валідація даних
│   └── monobank.js        ✅ Monobank API клієнт
└── db/
    └── init.sql           ✅ PostgreSQL схема
```

## 📝 Налаштування

### 1️⃣ Встановлення PostgreSQL

**На Windows:**

- Завантажити: https://www.postgresql.org/download/windows/
- Під час установки:
  - User: `postgres`
  - Password: Запам'ятати!
  - Port: `5432`

**Або Docker:**

```bash
docker run --name postgres -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres:14
```

### 2️⃣ Створити базу даних

```bash
# Підключитися до PostgreSQL
psql -U postgres

# У psql консолі:
CREATE DATABASE blagodat_shop;
\c blagodat_shop
```

### 3️⃣ Запустити Schema

```bash
# Від папки backend/:
psql -U postgres -d blagodat_shop -f db/init.sql

# Результат:
# CREATE TABLE
# CREATE INDEX
# ...
```

### 4️⃣ Налаштування .env

Відредагувати `backend/.env`:

```env
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blagodat_shop
DB_USER=postgres
DB_PASSWORD=ВАШ_ПАРОЛЬ_POSTGRES    ← Змінити!

# MONOBANK (отримати в кабінеті https://cabinet.monobank.ua)
MONOBANK_TOKEN=your_token_here

# FRONTEND
FRONTEND_URL=http://localhost:5173
```

### 5️⃣ Встановлення Dependencies

```bash
cd backend
npm install
```

### 6️⃣ Запуск Server

```bash
npm run dev
# Результат:
# ✅ Database connected: 2024-XX-XX ...
# 🚀 Server running at http://localhost:3000
```

## 🧪 Тестування API

### Перевіра здоров'я server'у

```bash
curl http://localhost:3000
# Result: {"message":"Благодать Крамниця API","version":"1.0.0","status":"running"}
```

### Створити замовлення

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Іван Петренко",
    "phone": "+380951234567",
    "email": "ivan@mail.com",
    "address": "м. Івано-Франківськ, вул. Тестова, 1",
    "payment_method": "monobank",
    "items": [
      {"id": 101, "name": "Біблія", "price": 299, "qty": 1, "image": ""}
    ]
  }'
```

### Отримати замовлення

```bash
curl http://localhost:3000/api/orders/1
```

## 🔑 Отримання Monobank Token

1. Перейти на https://cabinet.monobank.ua
2. Увійти або зареєструватися
3. Розділ **"Майстер оплати"** → **"API"**
4. Скопіювати **X-Token** (зберегти в `backend/.env` як `MONOBANK_TOKEN`)

## 📊 Перевіра БД

```bash
# Підключитися до БД
psql -U postgres -d blagodat_shop

# Запити:
\dt                    # Список таблиць
SELECT * FROM orders;  # Переглянути замовлення
SELECT * FROM payments; # Переглянути платежі
```

## 🐛 Поширені проблеми

### Error: connect ECONNREFUSED 127.0.0.1:5432

→ PostgreSQL не запущений

```bash
# Windows: запустити PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Error: password authentication failed

→ Неправильний пароль в `.env`

```bash
# Скинути пароль PostgreSQL:
psql -U postgres -c "ALTER USER postgres PASSWORD 'new_password';"
```

### CORS Error

→ Frontend та Backend на різних портах

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- ✅ CORS налаштований у `server.js`

## 🎯 Наступні кроки

- [ ] Налаштувати Monobank Token в `.env`
- [ ] Запустити PostgreSQL
- [ ] Запустити `npm install && npm run dev`
- [ ] Тестувати замовлення через checkout.html
- [ ] Реалізувати PrivatBank інтеграцію
- [ ] Email підтвердження

---

**Потребуєте допомоги?** Перевіра поточний раздел налаштування або повідомить про помилку.
