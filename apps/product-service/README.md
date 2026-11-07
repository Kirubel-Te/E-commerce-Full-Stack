# Product Service

The Product Service is the catalog backend for the e-commerce platform. It exposes REST endpoints for managing products and categories, validates admin actions, and publishes catalog events for downstream services.

## Features

- Product CRUD operations
- Category management
- Product listing with search, category filtering, sorting, and limit support
- Clerk-based authentication and admin authorization
- Prisma integration with PostgreSQL
- Kafka event publishing for product lifecycle changes
- Health check endpoint for service monitoring

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Clerk Auth
- Kafka
- CORS

## Prerequisites

Before running the service, make sure you have:

- Node.js 18 or later
- pnpm 9 or later
- A PostgreSQL database
- A Kafka broker available for event publishing
- A Clerk application configured for authentication

## Environment Variables

Create a `.env` file in this directory with values similar to the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5433/product?schema=public"
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

The server listens on port `8004` by default.

## Installation

From the monorepo root:

```bash
pnpm install
```

## Running the Service

Start the service in development mode:

```bash
pnpm --filter product-service dev
```

To run a TypeScript check:

```bash
pnpm --filter product-service check-types
```

## API Endpoints

### Health

- `GET /health` — returns the service health status

### Products

- `GET /product` — fetch all products
- `GET /product/:id` — fetch a single product
- `POST /product` — create a product (admin only)
- `PUT /product/:id` — update a product (admin only)
- `DELETE /product/:id` — delete a product (admin only)

Query parameters for `GET /product`:

- `sort=asc|desc|oldest` — sort by price or creation date
- `category=<slug>` — filter by category slug
- `search=<term>` — search by product name
- `limit=<number>` — limit the number of results

### Categories

- `GET /category` — fetch all categories
- `POST /category` — create a category (admin only)
- `PUT /category/:id` — update a category (admin only)
- `DELETE /category/:id` — delete a category (admin only)

### Auth Test

- `GET /test` — protected route that returns the authenticated user ID

## Admin Authorization

Some routes are protected with `shouldBeAdmin`, which validates the user role before allowing product or category mutations.

## Event Publishing

When a product is created or deleted, the service publishes Kafka messages:

- `product.created`
- `product.deleted`

These events are used by dependent services that need product catalog updates.

## Project Structure

```text
src/
├── controllers/
│   ├── category.controller.ts
│   └── product.controller.ts
├── middleware/
│   └── authMiddleware.ts
├── routes/
│   ├── category.route.ts
│   └── product.route.ts
├── utils/
│   └── kafka.ts
├── index.ts
└── ...
```

## Notes

- Product creation validates that a non-empty `colors` array is provided and that each color has a matching image entry.
- Product prices are returned as numbers for client consumption.
- The service is designed to work as part of the monorepo and is consumed by the storefront UI and other commerce services.
