# WhatsApp cloud integration — 17 November 2026

The working Fast2SMS Shopify app still sends the simple order confirmation using template `44524`. It has **not** been disabled or replaced.

A separate cloud service has been built for payment-aware template `44528`, `pnp_order_confirmation_payment`. The service calculates the actual payment and outstanding balance from Shopify, rather than assuming every advance is ₹99.

- Site: https://pnp-order-messages.madeditsfr.chatgpt.site
- Sites project ID: `appgprj_6afc227302688191801b0d399ed9000d`
- Source commit: `2238e9bb78876aa9a23da68ce058887d0344ea0c`
- Private deployment succeeded; D1 tables exist; 12 local tests passed.
- Hosted checks: authenticated service health returned 200; unsigned Shopify requests returned 401; unconfigured synthetic-test access returned 403.
- Current mode: `test`. Customer sending is off. No Fast2SMS key or Shopify signing secret has been connected, no webhook has been saved, and no real message has been sent by this service yet.
- Permission is pending to store the existing credentials in server-only secrets, receive Shopify order/customer/payment data, and make the signature-protected callback publicly reachable. The private controls and records must remain restricted to the owner.

The service source lives in the Site's own private source repository, separate from this Shopify theme. To continue on a Mac or another PC, use the Sites skill with this exact project ID and open its latest source through `get_site`, `create_source_repository_write_credential`, and the supported source workflow. Do not create another Site. Read `OPERATIONS.md` in that source before connecting or enabling customer sending.

PC checkout: `.cloud-work/whatsapp-confirmations` (ignored in this theme repository). Runtime credentials belong in Sites secret environment variables, never GitHub. There is no dependency on this PC staying online.

Before cutover, deliver and verify both synthetic owner-only WhatsApp tests, verify a signed Shopify webhook, and confirm actual partial-COD fields. Then disable and save the native app's `orders/create (whatsapp)` before enabling this service with a new-order activation timestamp. Never run two live confirmation senders for the same orders.
