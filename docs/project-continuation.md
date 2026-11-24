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
- `assets/base.css`: shared styling.
- `config/settings_data.json`: theme settings and app embeds; inspect actual live configuration before replacing it.
- `docs/next-order-tracking-check.md`: pending next-order tracking verification.
- `docs/whatsapp-cloud-integration.md`: messaging implementation history and the decision to keep the native Fast2SMS app.

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
