# Payment Service

A backend payment processing service built with Hono and Stripe integration for handling e-commerce checkout operations. This service manages Stripe checkout sessions and integrates with Clerk for authentication.

## Overview

The Payment Service is a TypeScript-based microservice that handles:
- **Checkout Session Creation**: Generate Stripe checkout sessions from cart data
- **Payment Processing**: Secure payment method handling with Stripe
- **Authentication**: User authentication via Clerk
- **CORS Support**: Cross-origin requests from the e-commerce frontend

## Technology Stack

- **Framework**: [Hono](https://hono.dev/) - Lightweight web framework for Node.js
- **Payment Provider**: [Stripe](https://stripe.com/) - Payment processing API
- **Authentication**: [Clerk](https://clerk.com/) - User authentication and management
- **Language**: TypeScript
- **Runtime**: Node.js with tsx for development

## Setup

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the payment-service directory with the following variables:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Running the Service

**Development mode:**
```bash
pnpm dev
```

The server will start on `http://localhost:8002`

**Production build:**
```bash
pnpm build
pnpm start
```

**Type checking:**
```bash
pnpm check-types
```

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns service health status and uptime
  - No authentication required
  - Response:
    ```json
    {
      "status": "ok",
      "uptime": 123.45,
      "timestamp": 1693478400000
    }
    ```

### Authentication Test
- **GET** `/test`
  - Verify authenticated user
  - Requires Clerk authentication
  - Response:
    ```json
    {
      "message": "Payment authenticated!",
      "userId": "user_123"
    }
    ```

### Create Checkout Session
- **POST** `/session/create-checkout-session`
  - Creates a Stripe checkout session for payment
  - Requires Clerk authentication
  - Request body:
    ```json
    {
      "cart": [
        {
          "id": 1,
          "name": "Product Name",
          "price": 29.99,
          "quantity": 2,
          "selectedSize": "M",
          "selectedColor": "blue"
        }
      ]
    }
    ```
  - Response:
    ```json
    {
      "checkoutSessionClientSecret": "seti_1234567890abcdef"
    }
    ```
  - Error Response (400):
    ```json
    {
      "error": "Cart is empty"
    }
    ```

## Project Structure

```
payment-service/
├── src/
│   ├── index.ts                 # Server entry point
│   ├── middleware/
│   │   └── authMiddleware.ts    # Clerk authentication middleware
│   ├── routes/
│   │   └── session.route.ts     # Checkout session endpoints
│   └── utils/
│       ├── stripe.ts           # Stripe client initialization
│       └── stripeProdcuts.ts   # Stripe product utilities
├── package.json
└── tsconfig.json
```

## Key Features

- **Secure Authentication**: Integrated with Clerk for user authentication
- **Stripe Integration**: Full Stripe checkout session management
- **CORS Enabled**: Configured to accept requests from frontend (localhost:3002)
- **Error Handling**: Comprehensive error messages and status codes
- **TypeScript**: Full type safety throughout the application
- **Health Monitoring**: Built-in health check endpoint for service monitoring

## Dependencies

### Production
- `@hono/clerk-auth` - Clerk authentication for Hono
- `@hono/node-server` - Node.js server adapter for Hono
- `hono` - Lightweight web framework
- `stripe` - Stripe API client

### Development
- `@repo/types` - Shared types from the monorepo
- `@repo/typescript-config` - Shared TypeScript configuration
- `@types/node` - Node.js type definitions
- `tsx` - TypeScript executor for development
- `typescript` - TypeScript compiler

## CORS Configuration

The service is configured to accept requests from:
- **Origin**: `http://localhost:3002` (e-commerce UI)
- **Credentials**: Enabled

## Environment Notes

- The service runs on port **8002**
- Stripe API version: `2026-07-29.dahlia`
- Clerk authentication is enforced on protected routes
- Product pricing is fetched from the Stripe API based on product IDs
