# Auth Service

A TypeScript Express service for managing authentication and user lifecycle operations in the e-commerce platform. It uses Clerk for identity management, enforces auth and admin authorization rules, and publishes user-creation events to Kafka for downstream services.

## Overview

The auth service is responsible for:

- Validating Clerk-based authentication on protected routes
- Enforcing role-based access control for admin-only endpoints
- Listing, fetching, creating, and deleting users via the Clerk API
- Publishing a `user.created` event after a new user is created
- Exposing a health check endpoint for service monitoring

## Tech stack

- Express 5
- TypeScript
- Clerk SDK (`@clerk/express`)
- KafkaJS via shared workspace package (`@repo/kafka`)
- CORS middleware
- pnpm workspaces + Turborepo

## Service responsibilities

This service sits in front of administrative user operations and acts as the authentication boundary for protected routes.

- Public routes: health checks and public access endpoints
- Protected routes: user management operations guarded by Clerk middleware
- Admin-only routes: user management endpoints require an `admin` role in the Clerk session claims

## Environment variables

Create a `.env` file in this service directory and define the following values:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

The app also depends on the shared Kafka brokers configured by the workspace package, which are expected to be available at:

- `localhost:9094`
- `localhost:9095`
- `localhost:9096`

## Local development

From the repository root:

```bash
pnpm install
```

Run the auth service in watch mode:

```bash
pnpm --filter auth-service dev
```

The service starts on port `8003`.

## Available endpoints

### Health

```http
GET /health
```

Returns the current service status and uptime.

### User routes

```http
GET /users
GET /users/:id
POST /users
DELETE /users/:id
```

#### Behavior

- `GET /users` - Lists all users from Clerk
- `GET /users/:id` - Fetches a single user by ID
- `POST /users` - Creates a new Clerk user and emits a `user.created` Kafka message
- `DELETE /users/:id` - Deletes a Clerk user

## Authentication and authorization

The service uses Clerk middleware:

```ts
app.use(clerkMiddleware());
```

Protected routes are checked with `shouldBeAdmin` before access is granted.

The `shouldBeAdmin` middleware will reject the request when:

- the user is not authenticated
- the Clerk session claims do not include the `admin` role

This is enforced through the custom session claim type, `CustomJwtSessionClaims`.

## Kafka integration

When a new user is created, the service sends a message to Kafka using the `user.created` topic:

```ts
await producer.sendMessage("user.created", {
  value: {
    username: user.username,
    email: user.emailAddresses[0]?.emailAddress,
  },
});
```

This allows other services such as email or notification flows to react to new user registration events.

## Example requests

### Health check

```bash
curl http://localhost:8003/health
```

### List users

```bash
curl http://localhost:8003/users \
  -H "Authorization: Bearer <clerk_session_token>"
```

### Create a user

```bash
curl -X POST http://localhost:8003/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk_session_token>" \
  -d '{
    "emailAddress": ["user@example.com"],
    "firstName": "Jane",
    "lastName": "Doe",
    "username": "jane.doe"
  }'
```

## Project scripts

From the service directory:

```bash
pnpm install
pnpm dev
pnpm check-types
```

## Notes

- The service is intended for internal/admin user operations and should be exposed only behind trusted infrastructure.
- Do not commit `.env` files or secret keys to source control.
- For local development, make sure your Clerk application is configured correctly and Kafka is running before starting the service.
