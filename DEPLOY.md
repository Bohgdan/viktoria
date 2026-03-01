# Деплой Perfect 4 You на Vercel

## Передумови

- Репозиторій на GitHub: `https://github.com/Bohgdan/viktoria`
- База даних: Railway PostgreSQL (вже працює)
- Аутентифікація: Supabase Auth (вже налаштовано)

## Крок 1: Увійти на Vercel

1. Перейти на [vercel.com](https://vercel.com)
2. Натиснути **Sign Up** або **Log In**
3. Обрати **Continue with GitHub**
4. Авторизувати Vercel доступ до GitHub

## Крок 2: Імпорт проєкту

1. На дашборді Vercel натиснути **Add New → Project**
2. Знайти репозиторій `Bohgdan/viktoria` і натиснути **Import**
3. Framework Preset буде автоматично визначений як **Next.js**
4. Root Directory залишити порожнім (проєкт у корені)

## Крок 3: Environment Variables

**ОБОВ'ЯЗКОВО** додати всі змінні середовища перед деплоєм.
В розділі **Environment Variables** додати:

| Назва | Значення | Опис |
|-------|----------|------|
| `DATABASE_URL` | `postgresql://postgres:vLAux...@turntable.proxy.rlwy.net:30356/railway` | PostgreSQL на Railway (PUBLIC URL!) |
| `NEXT_PUBLIC_SUPABASE_URL` | Значення з `.env.local` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Значення з `.env.local` | Supabase Anon Key |

> ⚠️ **ВАЖЛИВО:** DATABASE_URL повинен використовувати **public proxy URL** 
> (`turntable.proxy.rlwy.net:30356`), а НЕ internal URL 
> (`postgres-yx7.railway.internal:5432`). Internal URL працює тільки всередині Railway.

Значення змінних знаходяться у файлі `.env.local` у корені проєкту (він не закомічений у git).

## Крок 4: Деплой

1. Натиснути **Deploy**
2. Vercel автоматично виконає `npm run build`
3. Зачекати завершення білду (~1-2 хвилини)
4. Після успішного деплою отримаєте URL вигляду: `https://viktoria-xxxx.vercel.app`

## Крок 5: Перевірка

Після деплою перевірити:

- [ ] Головна сторінка відкривається
- [ ] Каталог показує товари з бази даних
- [ ] Адмін-панель `/admin/login` — сторінка входу працює
- [ ] Вхід в адмін-панель через Supabase Auth
- [ ] Створення/редагування товарів працює

## Крок 6: Кастомний домен (опціонально)

1. В Vercel Dashboard → Settings → Domains
2. Додати свій домен (наприклад: `perfect4you.com.ua`)
3. Налаштувати DNS записи згідно інструкцій Vercel

## Автоматичний деплой

Після підключення до Vercel кожен `git push` в `main` автоматично запускає новий деплой.

```bash
git add .
git commit -m "your changes"
git push origin main
# → Vercel автоматично задеплоїть
```

## Troubleshooting

### Помилка підключення до БД
- Перевірте що `DATABASE_URL` використовує public proxy URL Railway
- Перевірте що Railway PostgreSQL сервіс працює

### Помилка авторизації адмін-панелі
- Перевірте що `NEXT_PUBLIC_SUPABASE_URL` та `NEXT_PUBLIC_SUPABASE_ANON_KEY` правильні
- В Supabase Dashboard → Authentication → URL Configuration додайте Vercel URL в Redirect URLs

### 500 помилки на API роутах
- Vercel Dashboard → Logs — перегляньте серверні логи
- Перевірте що всі Environment Variables додані
