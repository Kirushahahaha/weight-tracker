# Weight Tracker

A personal weight, nutrition and workout tracker. PWA — installable on your phone like a native app.

## 🔗 Live app

**https://weight-tracker-lake-three.vercel.app**

On your phone: open the link → Share → "Add to Home Screen" (iPhone) or menu → "Add to Home screen" (Android).

## Features

- **Weight** — log weigh-ins, target weight, height, BMI, progress chart
- **Nutrition** — product search, barcode scanner (camera + photo), daily calories/macros counter
- **Workouts** — 8 ready-made programs, animated exercise GIFs, timer with rest periods, 3 difficulty levels
- **Cloud** — email sign-in, data synced across devices (Supabase)
- **Offline** — works without internet; data stored locally and in the cloud

## Tech stack

- React (Create React App)
- Supabase (auth + Postgres) for cloud sync
- Recharts — charts
- ZXing + BarcodeDetector — barcode scanning
- Open Food Facts API — product database
- PWA (manifest + service worker)

## Run locally

```bash
npm install
npm start
```

For cloud sync, set your Supabase keys in `src/supabaseClient.js`
(or via `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`),
and run the SQL from [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql) in your Supabase project.

## Deploy

```bash
npm run build
vercel --prod
```
