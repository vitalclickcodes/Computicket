# Payments

Paystack is the MVP payment provider. The integration is wrapped behind a `PaymentProvider` interface so Flutterwave, Moniepoint, OPay, and others can be added later without rewriting checkout.

## Why Paystack first

- Strong NGN coverage: cards, bank transfer, USSD, QR, Apple/Google Pay
- Mature API and webhook reliability
- Solid sub-accounts model (clean fit for organizer payouts)
- Good developer docs and sandbox

## Supported methods at launch

- Cards (Verve, Mastercard, Visa)
- Bank transfer (virtual accounts)
- USSD
- Paystack QR
- Apple Pay / Google Pay where supported

## Flow

1. Client creates an order via `POST /orders` — server holds inventory for N minutes
2. Server initializes a Paystack transaction with order amount, customer email, and `reference = order.id`
3. Client opens Paystack inline or redirect checkout
4. Paystack calls our webhook (`/webhooks/paystack`) with verified signature
5. On `charge.success`, server marks order paid, issues signed QR tickets, sends email + SMS, releases inventory hold
6. On failure/timeout, inventory is released

## Webhooks

- Verify `x-paystack-signature` HMAC SHA512 against `PAYSTACK_SECRET_KEY`
- Idempotent by `event` + `data.reference`
- Reject events older than 5 minutes (clock skew tolerance)

## Refunds & disputes

- Refunds initiated from admin console, posted via Paystack refunds API
- Partial refunds supported (e.g. service fee retained)
- Chargeback monitoring via Paystack dashboard webhooks

## Split payments & payouts

- Each organizer maps to a Paystack sub-account
- Use Paystack split codes to route platform commission to main account, balance to organizer
- Reconciliation job runs nightly against Paystack settlements

## Wallet (Phase 2)

- Internal wallet ledger keyed by user; double-entry
- Top up via Paystack (treated as a wallet credit, not an order)
- Refunds default to wallet, withdrawable to bank on request
- KYC required above a configurable threshold

## Environment variables

```
PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_IPS=52.31.139.75,52.49.173.169,52.214.14.220
```

## Future providers

- **Flutterwave** — secondary acquirer, pan-African expansion
- **Moniepoint / OPay / PalmPay** — direct wallet pulls for the unbanked-but-app-rich segment
- **Bank transfer aggregators** — NIP direct as a fallback
