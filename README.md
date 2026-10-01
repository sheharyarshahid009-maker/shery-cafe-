# Shery Cafe — Premium Cafe & Lounge

A modern, luxury, full-stack web application for **Shery Cafe**: gourmet food
ordering, table & gaming-area reservations, an AI chat assistant, and a complete
admin dashboard — all in a dark, gold-accented design.

## Tech Stack

| Layer      | Tech                                                              |
|------------|-------------------------------------------------------------------|
| Frontend   | Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide icons |
| State      | Zustand (cart, persisted to localStorage)                         |
| Backend    | Next.js Route Handlers + Server-side validation with Zod          |
| Database   | PostgreSQL + Prisma ORM                                           |
| Auth       | Credentials-based admin auth — bcryptjs hashing + signed session cookie (Web Crypto HMAC, no external auth library) |
| Payments   | Stripe SDK (with automatic mock fallback), JazzCash / EasyPaisa manual flow, COD, Pay at Table |

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (local or hosted, e.g. Supabase / Neon / RDS)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL, SESSION_SECRET (32+ random chars),
# ADMIN_EMAIL, STRIPE_SECRET_KEY (optional — see Payments below)

# 3. Create & migrate the database
npx prisma migrate dev --name init

# 4. Seed demo data (categories, ~24 menu items, promos, banners, admin user)
npm run prisma:seed

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000.

### Admin login

- URL: http://localhost:3000/admin/login
- Email: `admin@sherycafe.com` (or `ADMIN_EMAIL` from your env)
- Password: the value you seeded with — the default seed uses
  `shery-admin-123` unless `ADMIN_PASSWORD_HASH` was set in `.env` at seed time.

> **Change the admin password after first login** by updating the `User` row
> (hash new passwords with `bcryptjs`, cost 10) or by re-seeding with a custom
> `ADMIN_PASSWORD_HASH`.

## Payments

- **Stripe (card):** set `STRIPE_SECRET_KEY` to a test-mode key
  (`sk_test_...`). The checkout API creates a real `PaymentIntent` and returns
  its `client_secret`.
- **Mock fallback:** if `STRIPE_SECRET_KEY` is empty, the API returns a mock
  intent (`pi_mock_...`) so the whole checkout flow works end-to-end locally.
  The demo checkout page treats a mock intent as an approved test charge.
- **JazzCash / EasyPaisa:** implemented as manual mobile-wallet methods — the
  order is created as `UNPAID` with a manual reference and staff confirm
  payment in the admin panel (toggle Paid on the order). Wire your wallet
  merchant APIs into `src/app/api/checkout/route.ts` where marked.
- **COD / Pay at Table:** no online step; the order is paid on fulfilment.

## Key Routes

| Route                 | Description                                            |
|-----------------------|--------------------------------------------------------|
| `/`                   | Hero, bestsellers, gaming teaser, reviews, gallery     |
| `/menu`               | Tabbed menu, search, customizations, add to cart       |
| `/book`               | Table & play-area reservations (instant confirmation)  |
| `/checkout`           | Cart summary, promo codes, payment method selection    |
| `/admin/login`        | Admin sign-in                                          |
| `/admin`              | Sales / orders / reservations analytics                |
| `/admin/menu`         | Menu CRUD, stock toggles                               |
| `/admin/orders`       | Order status pipeline + payment toggles                |
| `/admin/reservations` | Accept / reject bookings                               |
| `/admin/promos`       | Promo codes + homepage banner toggles                  |

API endpoints live under `src/app/api/*` and validate every input with Zod.
Admin-only routes check the signed `shery_admin` session cookie
(`src/lib/admin-guard.ts`, enforced at the edge by `middleware.ts`).

## Project Structure

```
prisma/
  schema.prisma      # User, Category, MenuItem, Order, OrderItem,
                     # Reservation, PromoCode, Banner
  seed.ts            # demo catalog + admin user + promos + banners
src/
  app/               # App Router pages + API routes
  components/        # Navbar, Hero, MenuCard, CartDrawer, ChatWidget, …
  data/faq.ts        # chat knowledge base (hours, 18+ policy, rates)
  lib/               # prisma singleton, auth, stripe, formatters
  store/cart.ts      # Zustand cart (persisted)
middleware.ts        # guards /admin/*
```

## Deployment Notes

1. Set all env vars in your host (Vercel / VPS): `DATABASE_URL`,
   `SESSION_SECRET`, `STRIPE_SECRET_KEY`, `ADMIN_EMAIL`.
2. Run migrations against production: `npx prisma migrate deploy`.
3. Seed once: `npm run prisma:seed` (skip if data already exists — the seed
   uses upserts and is idempotent).
4. `npm run build && npm start`.
5. Serve behind HTTPS — the session cookie is `Secure` in production.
6. For image uploads in production, point `imageUrl` at Cloudinary / S3 /
   Supabase Storage and add the host to `next.config.js` `images.remotePatterns`.

## Notes & Limitations

- Sheesha lounge items are flagged `isAgeRestricted`; checkout requires an
  18+ confirmation checkbox before those orders can be placed.
- The AI chat assistant is rule-based (keyword + mood engine over the menu
  and FAQ data) — no external LLM key required. It can add items to the cart
  and deep-link to booking.
- Stripe Elements (client-side card form) is not bundled; the API returns the
  `client_secret` ready for an Elements integration in `CheckoutForm`.
