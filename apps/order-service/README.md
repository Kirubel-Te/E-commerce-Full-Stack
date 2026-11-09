# Order Service

The Order Service is the backend for managing customer orders in the e-commerce platform. It authenticates users with Clerk, stores order data in MongoDB, and listens for payment success events from the payment service to create records for completed purchases.

## Overview

This service is responsible for:
- persisting order records after successful payment
- returning a user's own order history
- allowing admin users to view all orders
- reacting to Kafka payment events from the payment service
- exposing lightweight health and authentication checks

## Features

- Clerk authentication for protected routes
- MongoDB-backed order storage via the shared order-db package
- Event-driven order creation from `payment.successful`
- Admin-only access to all orders
- Health check endpoint for service monitoring
- TypeScript-based Fastify API

## Tech Stack

- Node.js
- TypeScript
- Fastify
- MongoDB with Mongoose
- Clerk
- Kafka via the monorepo Kafka package

## Prerequisites

Before running the service, make sure you have:

- Node.js 18 or later
- pnpm 9 or later
- A MongoDB database connection string
- A Clerk application configured for authentication
- Kafka connectivity for the monorepo event bus

## Environment Variables

Create a `.env` file in `apps/order-service` with the following variables:

```env
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
MONGODB_URL="mongodb+srv://<user>:<password>@<cluster>/orders?retryWrites=true&w=majority"
```

## Installation

From the monorepo root:

```bash
pnpm install
```

## Running the Service

Start the service in development mode:

```bash
pnpm --filter order-service dev
```

The service listens on port `8001` by default.

Run a type check:

```bash
pnpm --filter order-service check-types
```

## API Endpoints

### Health

- `GET /health`
  - Returns service uptime and timestamp.

### Auth Test

- `GET /test`
  - Protected route.
  - Returns the authenticated user ID.

### User Orders

- `GET /user-order`
  - Requires authentication.
  - Returns all orders for the current authenticated user.

### Admin Orders

- `GET /orders`
  - Requires admin authorization.
  - Returns all orders in the system.

## Order Model

Orders are stored in MongoDB with the following fields:

- `userId`: authenticated user ID
- `email`: customer email
- `amount`: total order amount
- `status`: order status (`success` or `failed`)
- `products`: array of ordered products with:
  - `name`
  - `quantity`
  - `price`
- timestamps for creation and updates

## Event Flow

The order service subscribes to Kafka events from the payment service:

- `payment.successful`

When it receives a payment success message, it creates a MongoDB order record using the `createOrder` utility. After saving the order, it publishes an `order.created` event to Kafka.

## Project Structure

```text
apps/order-service/
├── src/
│   ├── index.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── routes/
│   │   └── order.ts
│   └── utils/
│       ├── kafka.ts
│       ├── order.ts
│       └── subscriptions.ts
├── .env
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Notes

- The service does not expose a direct order-creation endpoint; order records are generated in response to successful payment events.
- Admin access is determined using Clerk session claims and the `metadata.role` field.
- The shared database package `@repo/order-db` manages the MongoDB connection and schema.
- The service is designed to work as part of the monorepo and acts as the downstream consumer of payment success events.
