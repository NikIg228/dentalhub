# DentHub ClientApp

Next.js frontend для рабочей закупочной системы DentHub.

## Запуск

```bash
npm install
npm run dev
```

Локальный адрес:

```text
http://localhost:3000
```

Проверка TypeScript:

```bash
npm exec tsc -- --noEmit --pretty false
```

## Структура

Основная рабочая область вынесена в route group:

```text
app/(workspace)
```

Это сохраняет общий shell между переходами и ускоряет навигацию внутри проекта.

Ключевые файлы:

- `app/layout.tsx` - root layout и шрифты.
- `app/(workspace)/layout.tsx` - общий layout рабочей области.
- `app/(workspace)/loading.tsx` - route loading skeleton.
- `components/AppShell.tsx` - sidebar, topbar, навигация.
- `components/FeedbackState.tsx` - reusable loading/error/fallback states.
- `lib/api.ts` - клиент для ASP.NET API.
- `app/globals.css` - дизайн-токены и стили.

## Реализованные Страницы

- `/dashboard` - обзор клиники.
- `/need` - поиск товара, сравнение поставщиков, черновик заказа.
- `/products` - каталог товаров.
- `/suppliers` - поставщики и филиалы.
- `/annotations` - аннотации к товарам.
- `/orders` - архив и контроль заказов.
- `/discounts` - скидки и предложения.
- `/login` - вход через backend API.

## API

Настройка backend URL:

```bash
cp .env.example .env.local
```

Затем указать:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:<backend-port>
```

Поддерживаемые endpoint:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/products`
- `GET /api/products/{id}/stocks`
- `GET /api/suppliers`
- `GET /api/annotations`

Если API недоступен, страницы используют локальные fallback-данные и показывают inline notice.

## Netlify Deploy

Frontend подготовлен к деплою на Netlify из монорепозитория.

Root config находится в:

```text
../netlify.toml
```

Ожидаемые настройки Netlify:

- Base directory: `ClientApp`
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`

Production env:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
```

Backend ASP.NET нужно деплоить отдельно. Netlify деплоит только Next.js frontend.

## Дизайн

Фронт приведен к светлому Apple-like стилю для B2B procurement dashboard:

- `Manrope` через `next/font`;
- единые токены цвета, радиусов, теней и motion;
- focus-visible, hover и active states;
- компактная рабочая плотность;
- skeleton loading вместо spinner;
- строгий `/login` без лишней промо-лендинговости.

## Навигация

Внутренние переходы используют `next/link`.

`AppShell` больше не находится внутри каждой страницы. Он вынесен в `app/(workspace)/layout.tsx`, поэтому sidebar и topbar не пересоздаются при переходах.
