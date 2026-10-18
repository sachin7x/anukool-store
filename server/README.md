# MakeGood API (Node.js + PostgreSQL + Razorpay)

Backend foundation for the MakeGood React storefront. It includes PostgreSQL persistence, admin-only catalogue/order APIs, server-side sessions, CSRF checks, rate limiting, checkout price calculation on the server, Razorpay order creation/signature verification, signed webhook processing, idempotent webhook event storage, and stock reservation/release for failed payments.

> This is a security-conscious starter, not a claim of completed compliance or a substitute for a pre-launch security review. Before accepting live payments, test against a staging database and Razorpay test mode, configure TLS and backups, and complete the production checklist in the root README.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- Razorpay account (use test keys until end-to-end testing is complete)

## Setup

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env`. Use a long random `SESSION_SECRET`; set `DATABASE_URL`, `FRONTEND_ORIGIN`, and Razorpay keys. In production, set `NODE_ENV=production`, serve behind HTTPS, and configure the reverse proxy to forward the original protocol. If your database provider requires TLS, set `DATABASE_SSL=true` and verify its certificate chain.

Create a database and role, for example:

```sql
CREATE ROLE makegood LOGIN PASSWORD 'use-a-long-unique-password';
CREATE DATABASE makegood OWNER makegood;
```

Apply schema:

```bash
npm run db:migrate
```

Create the first owner account. Set these only in the shell/environment for this one command; choose a unique password of at least 14 characters:

```bash
ADMIN_EMAIL=owner@example.com ADMIN_PASSWORD='replace-with-a-long-unique-password' ADMIN_NAME='Store owner' npm run db:seed-admin
```

Run locally:

```bash
npm run dev
```

Health check: `GET http://localhost:4000/api/health`.

## API overview

Public:
- `GET /api/products` — active catalogue.
- `GET /api/csrf` — session-bound CSRF token.
- `GET /api/auth/me` — current admin session (or null).
- `POST /api/auth/login` — `{ "email", "password" }`; returns admin and CSRF token.
- `POST /api/checkout/create-order` — product IDs, quantities and customer/shipping details. Prices are always read from PostgreSQL; the server creates a Razorpay order and reserves inventory.
- `POST /api/checkout/verify-payment` — verifies Razorpay checkout HMAC. Webhook capture is the authoritative payment-state update.
- `POST /api/payments/razorpay-webhook` — configure this exact public HTTPS URL in Razorpay dashboard.

Admin (session + CSRF required):
- `GET /api/products/admin/all`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id` — soft-deactivates a product.
- `GET /api/admin/orders`
- `GET /api/admin/orders/summary`
- `PATCH /api/admin/orders/:id/status`

For every unsafe request, send the current `x-csrf-token` header and include credentials/cookies. The session cookie is HttpOnly, SameSite=Strict, and Secure in production. Login is rate limited. Configure CORS to exact trusted frontend origins only.

## Razorpay setup
1. Start with test API keys in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. Set a separate random webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
3. In the Razorpay dashboard, register `https://YOUR_API_HOST/api/payments/razorpay-webhook` and subscribe to `payment.captured`, `payment.failed`, and `refund.processed`.
4. Use Razorpay Checkout on the frontend with the `keyId`, `razorpayOrderId`, and `amount` returned by `/api/checkout/create-order`. Pass the checkout response to `/api/checkout/verify-payment`; never trust a browser-only “success” state.
5. Test captured, failed, duplicate webhook, and network-retry scenarios in test mode before switching to live credentials.

## Important operational notes
- Stock is reserved when a payment order is created and released when a failed-payment webhook arrives. You must also run a scheduled reconciliation job for stale `awaiting_payment` orders (e.g. older than 20 minutes) and reconcile them with Razorpay before releasing stock; do not blindly release stock while a payment may still be processing.
- Keep API secrets only on the server. The Razorpay public key ID may be sent to the browser; the key secret and webhook secret must never be prefixed with `VITE_` or bundled into frontend code.
- This implementation uses a single currency (INR) and a simple flat shipping rule (₹99 below ₹999). Configure tax, shipping zones, return/refund flows, delivery tracking, transactional email/SMS, customer privacy/retention, monitoring and backups for your actual operation.
- The storefront uses the API for catalogue, checkout, and authenticated admin catalogue/order actions when the backend is available. Cart and saved-kit preferences remain browser-local; customer accounts and order-history pages are not implemented.
- Consider adding MFA, password reset, admin audit logs, order idempotency keys, payment reconciliation, abandoned-checkout cleanup, integration tests, and a managed secrets vault before production.
