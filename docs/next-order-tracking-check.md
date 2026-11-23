# Next new order: verify purchase tracking

Status: PENDING. User instruction recorded 19 November 2026 (Asia/Calcutta).

When the user next mentions or asks about a new order, proactively perform this check for that order. Do not require the user to remember this task. This is a conversation-triggered check, not background monitoring or a request to create a test purchase.

## Checks

- Identify the Shopify order, creation time, payment method, final order total, discounts, shipping, currency, paid amount and outstanding amount. Check for an accidental duplicate order as well as duplicate tracking.
- Confirm the corresponding Purchase reaches the store's existing Meta dataset after the Razorpay Pixel + CAPI change. Obtain the dataset ID from the private project handoff or connected account.
- Verify it counts as ONE purchase after deduplication, not separate purchases from Shopify, Razorpay, browser Pixel and server CAPI. Compare available event IDs, timestamps, sources and deduplication diagnostics. Raw received-event totals alone do not establish how many purchases were counted.
- Check the Purchase value against the final order total and currency INR. For partial COD, distinguish the full order value from the Rs 99 advance and remaining balance; verify later balance collection does not count as another purchase.
- Distinguish event receipt from ad attribution. An organic order need not appear as an ad-attributed purchase. Note reporting delays and unavailable evidence instead of declaring success or failure from incomplete totals.
- Record the result and any remaining uncertainty here without customer contact details, access tokens or other secrets. If order-level deduplication cannot be established from the available tools, leave that part pending.

## Working rules

- A provider's configuration check does not establish successful end-to-end tracking for a new completed order.
- Keep support correspondence, account identifiers and order-specific evidence in the private chat or the relevant service, not this public repository.
- Verify the actual setting and meaning before applying support recommendations; similarly named data-sharing controls are not interchangeable.
- Do not create synthetic Purchase events, replay historical test purchases, place a paid test order, or restart ads just to perform this check.

## Result

Awaiting the next new order discussed with the user.
