# Зображення продуктів

Додайте сюди зображення продуктів з PDF-каталогу.

## Формат назв файлів

Використовуйте slug товару як назву файлу:
- `papryka-chervona-200g.jpg`
- `pryprava-universalna-450g.jpg`
- `kukurudza-420g.jpg`

## Рекомендації

- Формат: JPG або PNG
- Розмір: 600x600 px (квадратні)
- Якість: 80-90%
- Фон: прозорий або білий

## Після додавання

Оновіть `image_url` в базі даних Supabase:

```sql
UPDATE products SET image_url = '/images/products/papryka-chervona-200g.jpg' 
WHERE slug = 'papryka-chervona-200g';
```
