# E-commerce platform

This repository contains a full-stack e-commerce platform managed as a pnpm monorepo with [Turborepo](https://turborepo.dev/). It includes a customer storefront, an administration dashboard, backend services, shared TypeScript types, and database packages.

## Architecture

```text
Customer storefront (Next.js :3002) ─┐
                                     ├─ Product service (:8004)
Admin dashboard (Next.js :3003) ────┤  Order service (:8001)
                                     └─ Payment service (:8002) ── Stripe

Product data ── PostgreSQL + Prisma (@repo/db)
Order data   ── PostgreSQL (@repo/order-db)
Shared contracts ── @repo/types
Authentication ── Clerk
```

## Repository structure

### Applications and services

- `apps/e-commerce-ui` - Customer-facing Next.js storefront. Runs on port `3002`.
- `apps/Ecom-admin` - Next.js administration dashboard for products, users, orders, and payments. Runs on port `3003`.
- `apps/product-service` - Express API for products and categories. Runs on port `8004`.
- `apps/order-service` - Fastify API for orders. Runs on port `8001`.
- `apps/payment-service` - Hono API for Stripe checkout sessions. Runs on port `8002`.

### Shared packages

- `packages/product-db` (`@repo/db`) - Prisma client, schema, and product migrations for PostgreSQL.
- `packages/order-db` (`@repo/order-db`) - Order database connection and model package.
- `packages/types` (`@repo/types`) - Shared TypeScript and Zod contracts for authentication, carts, and products.
- `packages/kafka` (`@repo/kafka`) - KafkaJS-based shared messaging package.
- `packages/eslint-config` - Shared ESLint configurations.
- `packages/typescript-config` - Shared TypeScript compiler configurations.

## Requirements

- Node.js `>=18`
- pnpm `9.x`
- PostgreSQL
- Clerk application credentials
- Stripe secret key for payment flows

## Getting started

From the repository root:

```bash
pnpm install
```

Create `.env` files where each service expects them. At minimum, the payment service requires:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Configure the PostgreSQL connection values required by the Prisma and order database packages. Do not commit `.env` files or secret keys.

Generate the Prisma client and apply local migrations:

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
```

Start the development applications and services:

```bash
pnpm dev
```

Turborepo starts every package with a `dev` script. You can also run one workspace at a time:

```bash
pnpm --filter ecomgithub dev          # Storefront: http://localhost:3002
pnpm --filter admin dev               # Admin: http://localhost:3003
pnpm --filter product-service dev    # Product API: http://localhost:8004
pnpm --filter order-service dev      # Order API: http://localhost:8001
pnpm --filter payment-service dev    # Payment API: http://localhost:8002
```

## Common commands

Run these from the repository root:

```bash
pnpm dev              # Start all development processes
pnpm build            # Build all apps and packages
pnpm lint             # Lint all workspaces
pnpm check-types      # Type-check all workspaces
pnpm format           # Format TypeScript and Markdown files
```

Use Turborepo filters for a focused task:

```bash
pnpm exec turbo build --filter=admin
pnpm exec turbo check-types --filter=product-service
```

For a production payment service build:

```bash
pnpm --filter payment-service build
pnpm --filter payment-service start
```

## API overview

All services expose a health endpoint:

```text
GET http://localhost:8001/health
GET http://localhost:8002/health
GET http://localhost:8004/health
```

The main backend areas are:

- Product service: `/product` and `/category`
- Order service: order routes registered by the service
- Payment service: `POST /session/create-checkout-session`

Protected routes use Clerk authentication. The payment service uses Stripe to create checkout sessions from cart data.

## Database workflow

The product Prisma schema is in `packages/product-db/prisma/schema.prisma`. For local development, use:

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
```

For deployment, apply committed migrations with:

```bash
pnpm --filter @repo/db db:deploy
```

## Technology stack

- TypeScript across the monorepo
- Next.js, React, Tailwind CSS, and Zustand for the web applications
- Express, Fastify, and Hono for backend services
- PostgreSQL with Prisma
- Clerk for authentication
- Stripe for payments
- Turborepo and pnpm for workspace management
