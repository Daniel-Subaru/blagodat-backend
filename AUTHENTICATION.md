# 🔐 Аутентифікація для Благодать Крамниця

## 📋 Установка

### 1. Установіть залежності
```bash
cd backend
npm install
```

### 2. Оновіть БД схему
```bash
# Запустіть SQL скрипт для створення таблиці користувачів
psql -U postgres -d blagodat_shop -f db/init.sql
```

### 3. Отримайте OAuth учетні дані

#### Google OAuth
1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект
3. Активуйте Google+ API
4. Створіть OAuth 2.0 Client ID (Web application)
5. Додайте `http://localhost:3000/api/auth/google/callback` до Redirect URIs
6. Скопіюйте Client ID та Secret до `.env`

#### Facebook OAuth
1. Перейдіть на [Facebook Developers](https://developers.facebook.com/)
2. Створіть нов додаток
3. В Settings → Basic скопіюйте App ID та App Secret
4. В Facebook Login → Settings додайте `http://localhost:3000/api/auth/facebook/callback` до Valid OAuth Redirect URIs
5. Скопіюйте до `.env`

### 4. Оновіть `.env` файл
```env
JWT_SECRET=your_super_secret_key_12345
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_secret
```

## 🚀 Запуск

```bash
npm run dev
# Сервер запуститься на http://localhost:3000
```

## 🧪 Тестування API

### 1. Реєстрація (Email + Password)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Іван",
    "lastName": "Петренко"
  }'
```

### 2. Вхід (Email + Password)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Відповідь:**
```json
{
  "message": "Успішний вхід",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Іван",
    "lastName": "Петренко"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Отримання профілю (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Оновлення профілю
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Петро",
    "lastName": "Іванов",
    "phone": "+380951234567"
  }'
```

### 5. Google OAuth (у браузері)
```
http://localhost:3000/api/auth/google
```

### 6. Facebook OAuth (у браузері)
```
http://localhost:3000/api/auth/facebook
```

## 📱 Frontend Integration

### Login Page (`login.html`)
```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Пароль" required>
  <button type="submit">Вхід</button>
  <a href="/api/auth/google">Google</a>
  <a href="/api/auth/facebook">Facebook</a>
</form>

<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = '/';
  }
});
</script>
```

### Захист Protected маршрутів
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    // Redirected to login
    window.location.href = '/login.html';
  }
  
  const user = await response.json();
  console.log(user);
};
```

## 🔒 Безпека на Продакшені

- Змініть `JWT_SECRET` на довгий випадковий ключ
- Встановіть `cookie.secure: true` коли буде HTTPS
- Використовуйте environment-specific `.env` файли
- Додайте HTTPS в production
- Налаштуйте CORS для вашого домену
- Додайте rate limiting на API endpoints

## 📊 БД Schema

```
users
├── id (PK)
├── email (UNIQUE)
├── password (hashed with bcryptjs)
├── first_name
├── last_name
├── phone
├── avatar_url
├── auth_provider (local, google, facebook)
├── google_id (для Google OAuth)
├── facebook_id (для Facebook OAuth)
├── email_verified
├── is_active
├── created_at
└── updated_at
```

## 🐛 Troubleshooting

### "Database connection failed"
- Перевірте PostgreSQL запущена
- Перевірте `.env` DB credentials
- Перевірте таблиця `users` створена

### "Invalid token"
- Перевірте `JWT_SECRET` совпадает
- Токен не має закінчитися
- Передавайте `Bearer TOKEN` в Authorization header

### OAuth не працює
- Перевірте Client ID/Secret в `.env`
- Перевірте Redirect URI точно совпадает
- Перевірте origin CORS дозволяє frontend
