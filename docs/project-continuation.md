# Project continuation

Prepared 23 November 2026 for continued work in Codex Cloud.

## Source and deployment

- Repository: https://github.com/plainandpremium/plainandpremiumfirstwebsite
- Main branch: `main`. This is a Shopify Liquid theme, not a Node application. There is no package install or application build step for the theme itself.
- Storefront: https://plainandpremium.com
- Shopify CLI store configuration: `shopify.theme.toml`.
- A Git push does not prove a live Shopify deployment. Inspect the connected theme and live state before deploying. Preserve remote edits and compare against the latest live source when changing the theme.
- This repository is public. Never commit credentials, full chat transcripts, customer details, unused coupon lists, private support correspondence or account exports.

## Source map

- `layout/theme.liquid`: shared layout and integration includes.
- `snippets/site-header.liquid`, `snippets/instagram-banner.liquid`: navigation and the linked scrolling Instagram offer.
- `sections/main-product.liquid`, `snippets/product-information.liquid`: product page, size guide, shipping, exchanges and care information.
- `sections/main-cart.liquid`, `assets/cart.js`: cart interface and actions.
- `snippets/razorpay-magic-checkout.liquid`: Razorpay Magic Checkout loader and configuration from Shopify metafields. Preserve the supported integration; do not invent replacement credentials or hard-code secrets.
- `assets/checkout-scroll.js`: preserves the mobile storefront position while the official Razorpay overlay loads, opens and closes.
- `assets/base.css`: shared styling.
- `config/settings_data.json`: theme settings and app embeds; inspect actual live configuration before replacing it.
- `docs/next-order-tracking-check.md`: pending next-order tracking verification.
- `docs/whatsapp-cloud-integration.md`: messaging implementation history and the decision to keep the native Fast2SMS app.

## Checkout performance maintenance (24 November 2026)

- Removed global smooth scrolling because Razorpay repositions the parent page when opening/closing mobile checkout. Smooth scrolling is now explicitly limited to the size-guide action and respects reduced-motion preferences.
- Product/cart pages preconnect to Razorpay and preload the existing provider scripts. The native loader, metafield configuration and payment handlers remain authoritative; the hints do not execute a second integration.
- Tested both Buy now and cart checkout in a narrow desktop Chrome viewport; free shipping, selected size, payment options and the Rs 99 / Rs 600 partial-COD split remained available. No payment was completed. A real iPhone/Instagram in-app-browser performance check is still outstanding.
- Checkout readiness varied between roughly two and five seconds in individual local checks. These are not controlled speed benchmarks and do not establish a server-side speed improvement. Any remaining payment-frame latency requires further measurement; do not describe it as eliminated.
- The shipping-fee source commit changed copy, not payment scripts. Only `assets/base.css`, `layout/theme.liquid` and `sections/main-product.liquid` were deployed for this performance change. Preserve live app settings.

### Follow-up: iPhone checkout jump (24 November 2026)

- The user still saw a jump inside Instagram on iPhone. Inspection of the official provider script found an iPhone-specific `window.scrollTo(0, 0)` when it opens its iframe. Removing smooth scrolling alone does not prevent that reset.
- `checkout-scroll.js` captures the product/cart checkout button position on mobile and fixes the underlying body in place only when Razorpay signals loading or an open container. It restores its own inline styles and the original scroll position when checkout closes or loading fails. It does not intercept the payment action, override SDK methods, read customer information or change fallback navigation.
- A local browser fixture reproducing the provider scroll reset moved the product marker by 613 pixels without this fix and zero pixels with it. Close, load-failure and native-fallback checks also showed zero visual displacement. These are simulated lifecycle checks, not measurements on an actual iPhone.
- The unpublished theme passed actual Razorpay Buy now and cart open/cancel checks in narrow Chrome: one checkout iframe, the chosen size and coupon entry were present; free shipping and Rs 99 partial COD remained visible. Cancellation restored the exact captured scroll positions and removed the added body styles. No payment was completed.
- Theme Check: zero errors, 42 existing warnings. Deploy only `assets/checkout-scroll.js` and `layout/theme.liquid` for this follow-up. A final iPhone Instagram check remains necessary; do not claim that external checkout-loading latency has been eliminated.
- Published those two files to the existing live theme and read them back to confirm they match the source. The live Buy now open/cancel check preserved the page position and restored normal scrolling; coupon entry, free shipping and partial COD were visible. This remains desktop Chrome verification at mobile width, not a real iPhone test.

## Established storefront requirements

- Plain black and white T-shirts; sizes S, M and L. Fit wording: perfectly oversized and cropped; not too oversized, not too long.
- Garment lengths for both colours, supplied by the merchant on 24 November 2026: S 26 in / 66.04 cm, M 27 in / 68.58 cm, L 28 in / 71.12 cm. Display both units in the size guide, separately from the existing body-chest reference measurements.
- Keep the minimal site design and prioritize mobile users arriving from Instagram.
- Shipping: free on all orders in India, with no minimum spend (requested 23 November 2026). This applies to prepaid and partial-COD orders. Shopify rates and Razorpay Magic Shipping have separate configuration; keep both aligned with the storefront copy. Courier charges paid by the merchant are separate from customer delivery fees.
- Exchanges: requests within seven days; Rs 50 exchange shipping. Contact via the store's listed support number. Preserve the published conditions and damaged/incorrect-item provisions.
- Instagram offer: follow and DM for flat Rs 100 off. Banner below the header, clickable to the Instagram profile, with Instagram icon; no star decoration.
- Discount codes are created and validated in Shopify, not just in theme JavaScript. The offer uses individual one-use codes given manually through Instagram. Never publish the unused codes in this repository.

## State that lives outside Git

Shopify holds orders, stock, discounts, notification templates, app configuration and policies. Razorpay holds checkout/payment configuration; Shiprocket holds fulfillment, courier and notification state; Meta holds campaigns and tracking; Fast2SMS holds message templates and reports. Their current dashboards are authoritative. This source checkout is not an export of those systems.

The cloud continuation chat receives a separate private handoff with account references, latest observed states, support-ticket context, pending work and creative assets. Treat dated observations as history until rechecked. Access depends on the authenticated tools available in that chat; a repository clone does not transfer browser sessions or server-side secrets.

## Continuing safely

- Fetch and inspect changes before editing; preserve work from the user's other computer.
- Use appropriate theme checks for theme changes; do not treat documentation updates as a checkout test.
- Confirm the correct store, account and live/draft target before mutations.
- Keep a dated record of verified changes, pending checks and limitations in the private continuation chat.
- Do not replace working checkout integrations, restart ads, replay old customer events or enable the experimental cloud message sender just because a new workspace was created.
- The next new order discussed with the user triggers the tracking check linked above. Historical orders do not establish whether the latest tracking change works.
