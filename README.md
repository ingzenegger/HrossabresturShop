# Hrossabrestur 🧶

A handmade goods shop built with React, TypeScript, and Supabase. Browse crochet toys, hair accessories, home decor, clothing, and bookmarks.

**Live site:** [https://hrossabrestur.ingambeck.com](https://hrossabrestur.ingambeck.com)

**GitHub:** [https://github.com/ingzenegger/HrossabresturShop](https://github.com/ingzenegger/HrossabresturShop)

---

## Screenshots

![screenshot](https://github.com/user-attachments/assets/206c4a99-6432-4eff-a818-83238637af32)
![screenshot](https://github.com/user-attachments/assets/0f7db4bd-0a7e-4671-b7c1-a611a5bfe410)
![screenshot](https://github.com/user-attachments/assets/740d228d-5882-4b7c-9634-0c81e2cd9df2)
![screenshot](https://github.com/user-attachments/assets/a28aa4df-8198-4e3c-93ed-8ef056c2baba)
![screenshot](https://github.com/user-attachments/assets/39fd4600-bd25-4f72-b510-e43cc5c0b5f2)
![screenshot](https://github.com/user-attachments/assets/f520881e-aa2b-4756-a570-6fb64b560f37)

---

## Features

- Browse products by category
- Search for products
- View individual product pages
- User registration and login via Supabase Auth
- Cart with add, remove, and quantity controls
- Fake checkout with simulated card payment (no real transactions)
- Order confirmation page
- Order history in account section
- Responsive design for mobile and desktop

---

## Tech stack

- **React 19** with **TypeScript**
- **Vite** for build tooling
- **React Router v7** for routing
- **Supabase** for database and authentication
- **TanStack React Query** for server state and data fetching
- **Zustand** for global client state (cart, auth)
- **Tailwind CSS v4** for styling
- **ShadCN UI** for component primitives
- **Vitest** and **React Testing Library** for tests
- **Zod** for runtime type validation
- Deployed on **Vercel**

---

## Project structure

The project uses a feature-based folder structure:

```
src/
├── feature/
│   ├── auth/         # Login, sign-up, forgot password pages
│   ├── cart/         # Cart page, components, hooks
│   ├── checkout/     # Checkout page, order API, tests
│   ├── product/      # Product list and product detail
│   ├── account/      # Order history, settings, update password
│   └── shell/        # Layout, homepage, navigation
└── shared/
    ├── components/   # Reusable UI components
    ├── hooks/        # Shared hooks (useAuth, useCustomer)
    ├── lib/          # Supabase client, utilities
    ├── store/        # Zustand store (cart + auth state)
    └── types/        # Shared TypeScript types
```

---

## Running locally

The project connects to a shared class Supabase instance. If you have access to the Supabase project, create a `.env` file in the root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

---

## Running tests

```bash
npm test
```

Tests cover:

- **Cart store logic** — adding, removing, and updating item quantities (`src/shared/store/appStore.test.ts`)
- **Checkout API** — order insert success, order insert failure, order items insert failure (`src/feature/checkout/api/checkoutApi.test.ts`)
- **Checkout page** — empty card field validation, empty cart guard, API failure handling, successful navigation to confirmation (`src/feature/checkout/pages/CheckoutPage.test.tsx`)

---

## Notes

ESLint warnings in `src/shared/components/ui/` are from ShadCN UI library components and are not part of the project's own code. These are known and intentional — ShadCN components are generated third-party code and are not subject to the project's lint rules.

---

## Future plans

This project started as a school assignment but is intended to continue as a real shop for handmade goods.

The most significant planned change is a full localisation to Icelandic, as the shop is aimed at a local market. Selling finished items abroad is not currently planned, though patterns may be offered internationally at a later stage.

Other planned improvements include:

- Icelandic language throughout the UI
- Custom order requests — allowing customers to submit requests for specific items or restocks
- Email confirmation on sign-up and order confirmation
- Payment integration once the shop is ready for real transactions
- Product image improvements and additional product listings

---

## Checkout disclaimer

This shop does not process real payments. The checkout flow is a simulation for demonstration purposes only. No real card details should be entered.
