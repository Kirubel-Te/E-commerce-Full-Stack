# E-commerce Platform

This repository is a full-stack e-commerce platform organized as a pnpm monorepo with Turborepo. It combines a customer storefront, an administration dashboard, domain-specific backend services, shared packages, and event-driven integrations.

## Features

- Browse, search, filter, and view products
- Create an account and authenticate with Clerk
- Manage a shopping cart and place Stripe checkout sessions
- View customer order history
- Manage products, categories, users, orders, and payments
- Publish domain events between services with Kafka
- Send welcome and order notification emails
- View order totals and successful-order trends in the admin dashboard

## System overview

```text
Customer Storefront (:3002) ─┬─ Auth API (:8003)
                             ├─ Product API (:8004) ── PostgreSQL / Prisma
                             ├─ Order API (:8001) ──── MongoDB
                             └─ Payment API (:8002) ── Stripe
                                      │
Admin Dashboard (:3003) ─────────────┼─ Clerk
                                      │
                                   Kafka (:9094-9096)
                                      │
                                 Email service
```

The applications communicate through HTTP and Kafka:

- The storefront and admin dashboard call the backend APIs.
- Clerk protects customer and administrative routes.
- Product, order, and payment services exchange events through Kafka.
- The product service stores catalog data in PostgreSQL.
- The order service stores order data in MongoDB.
- Stripe creates and completes checkout sessions.
- The email service listens for user and order events and sends Gmail messages.

## Repository structure

```text
apps/
  e-commerce-ui/       Customer storefront (Next.js)
  Ecom-admin/          Administration dashboard (Next.js)
  auth-service/        User administration API (Express)
  product-service/     Product and category API (Express)
  order-service/       Order API and reporting (Fastify)
  payment-service/     Checkout and webhook API (Hono)
  email-service/       Kafka-driven email worker
packages/
  product-db/          PostgreSQL database and Prisma client
  order-db/            MongoDB connection and order models
  kafka/               Shared Kafka client, producer, and consumer
  types/               Shared Zod schemas and TypeScript types
  eslint-config/       Shared ESLint configuration
  typescript-config/   Shared TypeScript configuration
```

## Applications

| Component | Stack | Default address |
| --- | --- | --- |
| Customer storefront | Next.js 15, React 19, Tailwind CSS, Zustand | `http://localhost:3002` |
| Admin dashboard | Next.js 16, React 19, TanStack, Recharts | `http://localhost:3003` |
| Auth service | Express 5, Clerk | `http://localhost:8003` |
| Product service | Express 5, Prisma, PostgreSQL | `http://localhost:8004` |
| Order service | Fastify 5, Mongoose, MongoDB | `http://localhost:8001` |
| Payment service | Hono, Clerk, Stripe | `http://localhost:8002` |
| Email service | Node.js, KafkaJS, Nodemailer | No HTTP server |

Detailed setup and endpoint information is maintained in each component README:

- [Customer storefront](apps/e-commerce-ui/README.md)
- [Admin dashboard](apps/Ecom-admin/README.md)
- [Auth service](apps/auth-service/README.md)
- [Product service](apps/product-service/README.md)
- [Order service](apps/order-service/README.md)
- [Payment service](apps/payment-service/README.md)

## Technology stack

- TypeScript
- pnpm workspaces
- Turborepo
- Next.js and React
- Express, Fastify, and Hono
- PostgreSQL and Prisma
- MongoDB and Mongoose
- Clerk authentication
- Stripe Checkout and webhooks
- Kafka and KafkaJS
- Nodemailer with Gmail OAuth2
- Zod for validation and shared contracts

## Prerequisites

Install the following before starting the platform:

- Node.js 18 or newer
- pnpm 9
- PostgreSQL
- MongoDB or a MongoDB Atlas connection
- Kafka brokers available on ports `9094`, `9095`, and `9096`
- A Clerk application
- A Stripe account and API credentials
- Gmail OAuth2 credentials for the email worker

Use one terminal for infrastructure and another for the workspace development processes.

## Installation

From the repository root:

```bash
pnpm install
```

Generate the Prisma client and apply database migrations:

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
```

To apply migrations in a deployed environment:

```bash
pnpm --filter @repo/db db:deploy
```

## Environment configuration

Configuration is loaded from `.env` files inside the relevant apps and packages. Keep secrets local: `.env` files are ignored by Git.

### Frontend applications

Both `apps/e-commerce-ui` and `apps/Ecom-admin` need Clerk and backend URLs:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8003
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8004
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
```

### Backend services

| Component | Main variables |
| --- | --- |
| Auth service | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL` |
| Product service | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL` |
| Order service | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URL` |
| Payment service | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Email service | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` |
| Product database package | `DATABASE_URL` |
| Order database package | `MONGODB_URL` |

The storefront, admin dashboard, and services must use matching Clerk and CORS configuration.

## Running the platform

Start every workspace with a `dev` script:

```bash
pnpm dev
```

To run one component:

```bash
pnpm --filter ecomgithub dev
pnpm --filter admin dev
pnpm --filter auth-service dev
pnpm --filter product-service dev
pnpm --filter order-service dev
pnpm --filter payment-service dev
pnpm --filter email-service dev
```

Infrastructure dependencies should be ready before the services start:

1. Start PostgreSQL and configure `DATABASE_URL`.
2. Start MongoDB or confirm `MONGODB_URL`.
3. Start Kafka on `9094`, `9095`, and `9096`.
4. Start backend services.
5. Start the storefront and admin dashboard.

## Kafka event flow

The platform uses the following main topics:

| Topic | Publisher | Consumer |
| --- | --- | --- |
| `user.created` | Auth service | Email service |
| `product.created` | Product service | Payment service |
| `product.deleted` | Product service | Payment service |
| `order.created` | Order service | Email service |
| `payment.successful` | Payment service | Order service |

The shared `@repo/kafka` package defines the broker client, producer, and consumer helpers.

## API health checks

```text
GET http://localhost:8001/health
GET http://localhost:8002/health
GET http://localhost:8003/health
GET http://localhost:8004/health
```

The auth, product, order, and payment services also expose authenticated test routes. Protected domain routes require a valid Clerk session or bearer token and may require administrator privileges.

## Common commands

Run these from the repository root:

```bash
pnpm dev              # Start all development processes
pnpm build            # Build all workspaces
pnpm lint             # Lint all workspaces
pnpm check-types      # Type-check all workspaces
pnpm format           # Format TypeScript and Markdown files
```

Run Turborepo tasks for one workspace:

```bash
pnpm exec turbo build --filter=admin
pnpm exec turbo check-types --filter=product-service
pnpm exec turbo dev --filter=ecomgithub
```

## Database workflows

The Prisma catalog schema is in [packages/product-db/prisma/schema.prisma](packages/product-db/prisma/schema.prisma).

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
pnpm --filter @repo/db db:seed
pnpm --filter @repo/db db:deploy
```

The order package connects to MongoDB through Mongoose and manages order documents from the order service.

## Development notes

- App-specific ports are configured in their package scripts or source entry points.
- The frontend CORS and service URL values must match the running local services.
- Stripe webhooks require a public HTTPS endpoint in deployed environments.
- Do not expose Clerk secret keys, Stripe secret keys, database credentials, or OAuth refresh tokens in source code or documentation.
- Use the component README files for endpoint routes, implementation details, and service-specific troubleshooting.
