# Anime Management Frontend

Frontend React + Vite + Tailwind CSS untuk Anime Management System.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Backend harus berjalan di `http://localhost:3000`.

## Fitur

- **Explore** — Katalog anime dengan search, filter genre/status, pagination
- **Anime Detail** — Informasi lengkap + tambah ke watchlist
- **Auth** — Login & Register dengan JWT
- **Watchlist** — Kelola progres tontonan (status, episode, rating)
- **Admin** — CRUD anime (hanya role admin)

## Struktur Folder

```
src/
├── api/          # Axios client & API calls
├── store/        # Zustand auth store
├── hooks/        # Custom React hooks
├── components/   # UI, layout, feature components
├── pages/        # Route pages
├── routes/       # Route guards
└── utils/        # Constants & helpers
```

## Backend Migration

Jalankan SQL di `BackEnd/anime-management-api/docs/migrations/001_add_role_and_episodes_watched.sql` sebelum menggunakan fitur admin dan progres episode.
