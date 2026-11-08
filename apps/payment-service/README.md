# Payment Service

The Payment Service is the checkout and billing backend for the e-commerce platform. It creates Stripe checkout sessions, validates Stripe webhooks, authenticates users with Clerk, and emits payment events through Kafka for downstream services.

## Overview

This service handles the payment flow from the storefront to Stripe and back. When a customer initiates checkout, the frontend sends the cart payload to this service, which resolves product pricing and creates a Stripe Checkout Session. After payment completion, Stripe sends a webhook to this service, which verifies the signature and publishes a payment success event to Kafka.

## Features

- Stripe Checkout Session creation for cart-based purchases
- Secure Stripe webhook verification and processing
- Clerk authentication for protected payment routes
- Kafka integration for payment and product synchronization
- Health check endpoint for service monitoring
- CORS support for the storefront

## Tech Stack

- Node.js
- TypeScript
- Hono
- Stripe
- Clerk
- Kafka via the monorepo Kafka package

## Prerequisites

Before running the service, make sure you have:

- Node.js 18 or later
- pnpm 9 or later
- A Stripe account and API keys
- A Clerk application set up for authentication
- A Kafka broker configured for the monorepo
- The storefront running on `http://localhost:3002`

## Environment Variables

Create a `.env` file in `apps/payment-service` with the following variables:

```env
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

## Installation

From the monorepo root:

```bash
pnpm install
```

## Running the Service

Start the service in development mode:

```bash
pnpm --filter payment-service dev
```

The service listens on port `8002` by default.

Run a type check:

```bash
pnpm --filter payment-service check-types
```

Build for production:

```bash
pnpm --filter payment-service build
pnpm --filter payment-service start
```

## API Endpoints

### Health

- `GET /health`
  - Returns the current service health and uptime.

### Auth Test

- `GET /test`
  - Protected route that verifies Clerk authentication.
  - Returns the authenticated user ID.

### Create Checkout Session

- `POST /session/create-checkout-session`
  - Requires authentication.
  - Accepts a cart payload and creates a Stripe Checkout Session.

Example request body:

```json
{
  "cart": [
    {
      "id": "prod_123",
      "name": "Classic Tee",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

Example response:

```json
{
  "checkoutSessionClientSecret": "seti_1234567890abcdef"
}
```

### Get Session Status

- `GET /session/:session_id`
  - Retrieves the Stripe Checkout Session status and payment status.

### Stripe Webhook

- `POST /webhooks/stripe`
  - Receives Stripe webhook events.
  - Verifies the Stripe signature.
  - Handles `checkout.session.completed` events and emits payment results.

## Payment Flow

1. The storefront sends a checkout request with cart items.
2. The service resolves each item price from Stripe product data.
3. A Stripe Checkout Session is created with `ui_mode: "elements"`.
4. The client completes payment on the Stripe-hosted flow.
5. Stripe sends a `checkout.session.completed` webhook.
6. The webhook handler verifies the event and publishes `payment.successful` to Kafka.

## Kafka Integration

The service subscribes to product lifecycle messages from the catalog domain:

- `product.created`
- `product.deleted`

These events are used to synchronize Stripe product data with the product catalog.

## Project Structure

```text
apps/payment-service/
├── src/
│   ├── index.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── routes/
│   │   ├── session.route.ts
│   │   └── webhooks.route.ts
│   └── utils/
│       ├── kafka.ts
│       ├── stripe.ts
│       ├── stripeProdcuts.ts
│       └── subscriptions.ts
├── .env
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Notes

- Protected routes are guarded by Clerk authentication.
- CORS is configured to allow requests from the storefront UI.
- The service uses Stripe's `client_reference_id` to link payments back to the authenticated user.
- Stripe return URLs are configured to redirect back to the storefront checkout flow.
