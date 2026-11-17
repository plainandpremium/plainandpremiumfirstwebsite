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
