# StomST / DentHub

Документ фиксирует выполненную работу по проекту на текущем этапе: переход фронта на Next.js, Apple-like редизайн рабочих экранов, подключение к существующему ASP.NET backend и оптимизация навигации.

## Общая Картина

Проект состоит из:

- ASP.NET backend в корне проекта.
- Next.js frontend в `ClientApp`.
- Статических материалов и референсов в `wwwroot`.

Ключевое ограничение было сохранено: логика backend не переписывалась. Фронт строился поверх предоставленных данных и существующей доменной структуры.

## Что Сделано По Frontend

Frontend переведен в рабочее Next.js-приложение с App Router.

Реализованы и оформлены страницы:

- `/dashboard` - обзор клиники, KPI, рекомендации, последние заказы.
- `/need` - основной сценарий закупки: поиск товара, сравнение поставщиков, добавление в черновик заказа.
- `/products` - каталог товаров с поиском, категориями и переходом к подбору.
- `/suppliers` - поставщики, договоры, скидки, филиалы и контакты.
- `/annotations` - аннотации в формате master-detail.
- `/orders` - архив заказов, статусы, состав, документы.
- `/discounts` - скидки и коммерческие предложения.
- `/login` - экран входа через ASP.NET API.

Дизайн приведен к светлому Apple-like направлению:

- единая светлая палитра;
- премиальная типографика через `next/font`;
- шрифт `Manrope` с поддержкой кириллицы;
- дизайн-токены для цвета, радиусов, теней, motion и focus states;
- компактные рабочие панели вместо лендинговых hero-блоков;
- единые hover, active и focus-visible состояния;
- skeleton/loading/error/fallback states для API-страниц.

## Что Сделано По Backend

Backend оставлен в существующей архитектуре ASP.NET.

Добавлены API-контроллеры и DTO-слой для интеграции frontend:

- `Controllers/Api/AuthApiController`
- `Controllers/Api/ProductsApiController`
- `Controllers/Api/SuppliersApiController`
- `Controllers/Api/AnnotationsApiController`
- `Dtos/AuthDtos`
- `Dtos/ProductDtos`
- `Dtos/SupplierDtos`
- `Dtos/AnnotationDtos`

В `Program.cs` добавлена поддержка API controllers и CORS для frontend.

Фронт сейчас ожидает следующие endpoint:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/products`
- `GET /api/products/{id}/stocks`
- `GET /api/suppliers`
- `GET /api/annotations`

## API Integration

Frontend API-клиент находится в:

```text
ClientApp/lib/api.ts
```

Переменная окружения:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:<backend-port>
```

Пример:

```bash
cd ClientApp
cp .env.example .env.local
```

После этого нужно указать актуальный backend URL в `.env.local`.

Если API недоступен, страницы не ломаются: используются локальные fallback-данные, а пользователю показывается inline notice.

## Оптимизация Навигации

Была исправлена заметная задержка при переходах между страницами.

Сделано:

- внутренние переходы переведены с обычных `<a href>` на `next/link`;
- рабочие страницы перенесены в route group `app/(workspace)`;
- `AppShell` вынесен в общий `app/(workspace)/layout.tsx`;
- sidebar/topbar больше не пересоздаются при каждом переходе;
- активный пункт меню определяется через `usePathname`;
- login redirect переведен на `router.replace`;
- добавлен `app/(workspace)/loading.tsx`;
- убраны staged-анимации с `/need`, из-за которых блоки визуально появлялись по очереди.

## Taste-Skill Redesign Work

Для редизайна применялся подход `taste-skill`:

- сначала анализ существующего интерфейса;
- затем точечный редизайн без переписывания логики;
- приоритет на рабочую плотность B2B-интерфейса;
- отказ от лишней лендинговости;
- единые состояния компонентов;
- меньше card soup, больше продуктовой структуры.

Выполненные taste-skill улучшения:

- `/login` сделан более строгим и продуктовым;
- добавлен show/hide password;
- demo-ссылка скрывается в production;
- исправлена устаревшая некорректная дата в скидках;
- каталог товаров, поставщики, аннотации и заказы уплотнены;
- добавлены reusable feedback components:
  - `InlineNotice`
  - `SkeletonList`
  - `LoadingBadge`

## Запуск Frontend

```bash
cd ClientApp
npm install
npm run dev
```

Локальный адрес:

```text
http://localhost:3000
```

Проверка TypeScript:

```bash
cd ClientApp
npm exec tsc -- --noEmit --pretty false
```

## Деплой На Netlify

Проект подготовлен к деплою frontend-части на Netlify.

Добавлен файл:

```text
netlify.toml
```

Netlify должен собирать только Next.js приложение из `ClientApp`.

Настройки в Netlify UI:

- Base directory: `ClientApp`
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`

Эти значения уже продублированы в `netlify.toml`, поэтому при импорте репозитория Netlify должен считать их автоматически.

Переменная окружения для production:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
```

Важно: ASP.NET backend не деплоится на Netlify этим конфигом. Его нужно развернуть отдельно, а в Netlify указать публичный URL backend API.

Если backend находится на другом домене, на backend должна быть разрешена CORS-политика для Netlify-домена frontend.

## Проверенные Маршруты

На текущем этапе проверялись маршруты:

- `/dashboard`
- `/need`
- `/products`
- `/suppliers`
- `/annotations`
- `/orders`
- `/discounts`
- `/login`

Все маршруты возвращали `200` после последней проверки.

## Важные Файлы

Frontend:

- `ClientApp/app/layout.tsx`
- `ClientApp/app/(workspace)/layout.tsx`
- `ClientApp/app/(workspace)/loading.tsx`
- `ClientApp/components/AppShell.tsx`
- `ClientApp/components/FeedbackState.tsx`
- `ClientApp/lib/api.ts`
- `ClientApp/app/globals.css`

Backend:

- `Program.cs`
- `Controllers/Api/*`
- `Dtos/*`

## Текущее Состояние

Фронт уже можно использовать как полноценный рабочий прототип закупочной системы:

1. Пользователь входит через `/login`.
2. Переходит в рабочую область.
3. Ищет товар в `/need` или `/products`.
4. Сравнивает поставщиков.
5. Добавляет позицию в черновик заказа.
6. Просматривает поставщиков, аннотации, заказы и скидки.

Часть данных уже готова к получению из backend API. Если backend недоступен или endpoint возвращает пустой ответ, frontend сохраняет работоспособность через fallback-данные.

## Следующие Рекомендуемые Шаги

1. Подключить реальные API для заказов и скидок.
2. Реализовать создание заказа из черновика на `/need`.
3. Добавить server/cache strategy для товаров, поставщиков и аннотаций.
4. Провести responsive QA на desktop/tablet/mobile.
5. Добавить production auth guard для workspace routes.
6. Подготовить отдельный `DESIGN.md` с дизайн-токенами и правилами компонентов.
