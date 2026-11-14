# Moin's Style Studio: backend

The API shared by the Moin's Style Studio website ([Moinstyle](https://github.com/thisalkekirideniya-ui/Moinstyle)) and admin panel ([Moinstyle-admin](https://github.com/thisalkekirideniya-ui/Moinstyle-admin)): site content, booking requests, photos and admin accounts. Node 20.12+ and Express.

- Data is stored in **Supabase** (table `admin_documents`, created by [supabase.sql](supabase.sql)). Without Supabase settings it falls back to files in `storage/`.
- Photo uploads go to **Cloudinary**. Without Cloudinary settings they are saved in `storage/uploads` and served at `/images/u/`.

## Setup

```bash
npm install
cp .env.example .env    # then fill in the values; .env is never committed
npm run dev             # http://localhost:4000
```

Run `supabase.sql` once in the Supabase SQL Editor before the first start.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start with auto-restart on changes |
| `npm start` | Start for production |
| `npm run reset-password` | Reset an admin user's password |
| `npm run sync-images -- <website>/public/images` | Refresh the list of the website's built-in photos |

See `.env.example` for every setting (`CORS_ORIGINS`, `SESSION_SECRET`, `COOKIE_SAMESITE`, `TRUST_PROXY`, ...).
