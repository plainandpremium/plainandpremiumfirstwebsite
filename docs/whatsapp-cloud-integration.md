# WhatsApp cloud integration — 17 November 2026

The working Fast2SMS Shopify app still sends the simple order confirmation using template `44524`. It has **not** been disabled or replaced.

A separate cloud service has been built for payment-aware template `44528`, `pnp_order_confirmation_payment`. The service calculates the actual payment and outstanding balance from Shopify, rather than assuming every advance is ₹99.

- Site: https://pnp-order-messages.madeditsfr.chatgpt.site
- Sites project ID: `appgprj_6afc227302688191801b0d399ed9000d`
- Source commit: `b23788e422f026db528afe6b7a3d7008f3fa0905`
- Public callback approved by the user and deployed, with private admin controls. Runtime environment revision 4; 14 local tests passed, including actual Workers request construction.
- Existing Fast2SMS API key and Shopify signing secret are connected as server-only secrets. No credentials were rotated or committed.
- Shopify JSON webhooks (API 2026-10): Order creation, Order update, Order payment → `https://pnp-order-messages.madeditsfr.chatgpt.site/webhooks/shopify/orders`. All three Shopify built-in tests passed signature, shop and topic validation and were recorded without customer sends.
- Owner-only synthetic WhatsApp tests were delivered on 17 November at 16:22 IST. Prepaid: `#TEST-PAID`, ₹749, `Paid in full.` Partial COD: `#TEST-COD`, ₹749, `₹99 paid online. ₹650 payable on delivery.` Fast2SMS reports 3968322 and 3968323; request IDs `Wmi96YkqoDjPTS7` and `W3WpsSiU5yh5Uph`. A repeated prepaid test returned duplicate and sent nothing. No real Shopify orders were created.
- Temporary signed test access was removed and the service redeployed. Hosted checks: health 200; anonymous admin 403; disabled test route 403; unsigned Shopify request 401. Earlier spoofed owner identity headers were also rejected.
- Current mode remains **test**. Cloud customer sending is off; the native simple confirmation remains the only live WhatsApp sender.

The first two cloud attempts failed before reaching Fast2SMS because Workers rejects the `redirect: 'error'` fetch option. This was reproduced in a local Workers runtime and fixed to use `manual` with redirects blocked. Their uncertain records remain for audit; only the corrected `test-v2` messages were sent. Provider acceptance is recorded in D1; delivered status was independently verified in Fast2SMS, not inferred from the API response.

The service source lives in the Site's own private source repository, separate from this Shopify theme. To continue on a Mac or another PC, use the Sites skill with this exact project ID and open its latest source through `get_site`, `create_source_repository_write_credential`, and the supported source workflow. Do not create another Site. Read `OPERATIONS.md` in that source before connecting or enabling customer sending.

PC checkout: `.cloud-work/whatsapp-confirmations` (ignored in this theme repository). Runtime credentials belong in Sites secret environment variables, never GitHub. There is no dependency on this PC staying online.

Remaining before live cutover: confirm actual partial-COD webhook fields (`financial_status`, `total_price`, `current_total_price`, `total_outstanding`, `razorpay_partial_cod` tag and contact phone). Synthetic examples prove delivery and formatting, not real Razorpay order mapping. Obtain the user's go-ahead to switch customer sending, then disable and save native `orders/create (whatsapp)` before enabling the cloud service with a new-order activation timestamp. Never run two live confirmation senders for the same orders or backfill historical orders automatically.

## Reliability check — 17 November, 16:35 IST

Hosting is managed ChatGPT Sites, executing in Cloudflare Workers with persistent D1 storage. It has no dependency on either personal computer, an open chat, or a browser login session. The platform reported active/public, version 3; runtime revision 4 remained `SEND_MODE=test`. The source matched the published commit. Health returned 200, anonymous controls 403, unsigned webhook 401, and removed temporary test access 403. Health checks only prove the handler responds; they do not check the full Shopify-to-WhatsApp delivery path or establish an uptime guarantee.

This version is **not yet suitable as an unattended sole customer-confirmation sender**. A local fault-injection check using the deployed source and an isolated in-memory database (no external messages) confirmed:

- Fast2SMS HTTP 429: first call becomes `failed` and returns Shopify HTTP 200; a repeated event becomes `duplicate`, with no recovery send.
- Provider timeout: first call becomes `uncertain` and returns HTTP 200; repeat is suppressed. This avoids duplicate messages but can leave a missed confirmation unresolved.
- A record left in `sending` by an interrupted process is not reclaimed automatically.

There is no durable outbound message queue, automated provider-delivery reconciliation, periodic Shopify order reconciliation, unattended failure alert or balance/hosting-usage monitor. D1 records provider acceptance, not final WhatsApp delivery. No sustained-availability SLA or account-specific hosting capacity guarantee was verified. These are gaps in the current implementation, not evidence that the Cloudflare hosting itself is broken.

Before live use, add durable recovery with safe retries, resolve ambiguous sends against provider status, alert on stuck/failed messages and low credit, and verify the actual Razorpay partial-COD payload. Preserve the native simple sender until a coordinated cutover. Do not blindly retry uncertain sends or run both senders live.

Official references checked: [Cloudflare runtime](https://developers.cloudflare.com/workers/reference/how-workers-works/), [Shopify delivery/retry and queue guidance](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries), [Sites hosting and pricing](https://learn.chatgpt.com/docs/sites). Sites documentation currently says hosting is free through 31 December 2026, then traffic/storage above the plan's shared monthly allowance is chargeable from 1 January 2027. The user's exact allowance/available credits were not inspected; do not assume unlimited free hosting.
