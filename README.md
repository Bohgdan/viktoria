# Perfect 4 you - Оптовий постачальник продуктів харчування

Сайт-каталог для оптової торгівлі приправами, макаронами, консервами та олією.

**Контакти:**
- Телефон: +380 (50) 517-25-93
- Email: fop.payk@ukr.net

## Технології

- **Next.js 16** - React фреймворк з App Router
- **TypeScript** - Типізація
- **Tailwind CSS v4** - Стилізація (світла тема, зелений акцент)
- **Supabase** - База даних PostgreSQL, автентифікація, сховище файлів

## Швидкий старт (5 хвилин)

### Крок 1: Створіть Supabase проєкт

1. Зайдіть на [supabase.com](https://supabase.com) → "Start your project"
2. Увійдіть через GitHub (або створіть акаунт)
3. Натисніть "New project"
4. Заповніть:
   - Name: `perfect4you`
   - Database Password: придумайте пароль
   - Region: `West EU (France)`
5. Натисніть "Create new project" і зачекайте ~2 хв

### Крок 2: Скопіюйте ключі

1. В Supabase Dashboard йдіть в **Settings → API**
2. Відкрийте файл `.env.local` в цій папці і вставте:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co    # "Project URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...                 # "anon public"
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...                     # "service_role" (під "Reveal")
```

### Крок 3: Створіть таблиці

1. В Supabase Dashboard йдіть в **SQL Editor**
2. Натисніть "New query"
3. Скопіюйте весь вміст файлу `supabase/migrations/001_initial_schema.sql` і виконайте
4. Скопіюйте весь вміст файлу `supabase/migrations/002_perfect4you_seed.sql` і виконайте

### Крок 4: Створіть адміністратора

1. В Supabase Dashboard → **Authentication → Users**
2. Натисніть "Add user" → "Create new user"
3. Введіть email та пароль (запам'ятайте!)

### Крок 5: Створіть bucket для картинок

1. В Supabase Dashboard → **Storage**
2. Натисніть "New bucket"
3. Name: `product-images`
4. Public bucket: ✓ ВКЛ
5. Збережіть

### Крок 6: Запустіть сайт

```bash
npm run dev
```

Готово! Відкрийте:
- **Сайт:** http://localhost:3000
- **Адмін:** http://localhost:3000/admin (увійдіть з email/паролем з кроку 4)

---

## Структура категорій

| Категорія | Підкатегорії |
|-----------|--------------|
| Приправи та спеції | Паприка, Перець, Куркума, Кмин, Суміші |
| Макаронні вироби | Рожки, Спіраль, Вермішель, Лапша, Галушка |
| Консерви | Кукурудза, Горошок, Квасоля, Огірки, Томати |
| Олія та жири | Олія 1л, 2л, 5л |
| Бакалія | Сода, Лимонна кислота |
| Акційні товари | — |

## Структура проєкту

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Адмін-панель
│   │   ├── products/       # Управління товарами
│   │   ├── categories/     # Управління категоріями
│   │   ├── reviews/        # Відгуки
│   │   ├── requests/       # Заявки з сайту
│   │   └── settings/       # Налаштування
│   ├── catalog/            # Каталог товарів
│   ├── about/              # Про нас
│   ├── delivery/           # Доставка та оплата
│   ├── contacts/           # Контакти
│   └── api/                # API routes
├── components/
│   ├── ui/                 # UI компоненти
│   ├── layout/             # Header, Footer, etc.
│   ├── home/               # Секції головної
│   ├── catalog/            # Компоненти каталогу
│   └── admin/              # Компоненти адмін-панелі
└── lib/
    ├── supabase/           # Supabase клієнти
    ├── types.ts            # TypeScript типи
    ├── constants.ts        # Константи та placeholder тексти
    └── utils.ts            # Утиліти
```

## Налаштування теми

Відредагуйте CSS змінні в `src/app/globals.css`:

```css
:root {
  /* Dark theme (default) */
  --color-bg-primary: #0a0a0a;
  --color-accent: #c9a962;
  /* ... */
}
```

## Функціонал

### Публічна частина
- ✅ Головна сторінка з секціями
- ✅ Каталог з категоріями та підкатегоріями
- ✅ Картки товарів
- ✅ Сторінки товарів
- ✅ Контактна форма
- ✅ Месенджери (Viber, Telegram, WhatsApp)
- ✅ Адаптивний дизайн

### Адмін-панель
- ✅ Автентифікація
- ✅ Управління товарами (CRUD)
- ✅ Управління категоріями (дерево)
- ✅ Завантаження зображень
- ✅ Відгуки клієнтів
- ✅ Заявки з сайту
- ✅ Налаштування контактів та текстів

## Деплой

### Vercel (рекомендовано)

1. Push код на GitHub
2. Імпортуйте проєкт на [vercel.com](https://vercel.com)
3. Додайте Environment Variables
4. Deploy

---

Розроблено з ❤️ для українського бізнесу
