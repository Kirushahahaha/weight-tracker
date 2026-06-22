# Weight Tracker

Личный трекер веса, питания и тренировок. PWA — можно установить на телефон как приложение.

## 🔗 Приложение

**https://weight-tracker-lake-three.vercel.app**

Открой ссылку на телефоне → «Поделиться» → «На экран домой» (iPhone) или меню → «Добавить на главный экран» (Android).

## Возможности

- **Вес** — запись взвешиваний, цель, рост, ИМТ, график динамики
- **Питание** — поиск продуктов, сканер штрихкода (камера + фото), счётчик КБЖУ за день
- **Тренировки** — 8 готовых программ, анимированные GIF упражнений, таймер с отдыхом, 3 уровня сложности
- **Облако** — вход по email, синхронизация данных между устройствами (Supabase)
- **Офлайн** — работает без интернета, данные хранятся локально и в облаке

## Технологии

- React (Create React App)
- Supabase (auth + Postgres) для облачной синхронизации
- Recharts — графики
- ZXing + BarcodeDetector — сканер штрихкодов
- Open Food Facts API — база продуктов
- PWA (manifest + service worker)

## Запуск локально

```bash
npm install
npm start
```

Для облачной синхронизации укажи ключи Supabase в `src/supabaseClient.js`
(или через переменные `REACT_APP_SUPABASE_URL` и `REACT_APP_SUPABASE_ANON_KEY`),
а в Supabase выполни SQL из [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql).

## Деплой

```bash
npm run build
vercel --prod
```
