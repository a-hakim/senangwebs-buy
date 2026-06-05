---
name: senangwebs-buy
description: HTML attribute-driven WhatsApp e-commerce with product catalogs, carts, filtering, multi-store support, and checkout.
version: 1.3.9
package: senangwebs-buy
---

# SenangWebs Buy (SWB)

## Quick Reference

- **Purpose**: Declarative WhatsApp-based e-commerce with persistent carts
- **Entry**: `src/js/swb.js`; builds to `dist/swb.js` and `dist/swb.min.js`
- **Dependencies**: `@bookklik/senangstart-icons`
- **Scripts**: `npm run build`, `npm run dev`, `npm run test`

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-buy`. Read `README.md`, `package.json`, and touched source files. Match existing patterns, CSS prefix `swb-`.

## HTML Data Attributes

### Catalog (`data-swb-catalog` container)
| Attribute | Type | Default |
|---|---|---|
| `data-swb-catalog` | flag | required |
| `data-swb-store-id` | string | required |
| `data-swb-store` | string | required |
| `data-swb-whatsapp` | string | required |
| `data-swb-currency` | string | `USD` |
| `data-swb-color-primary` | hex | `#007bff` |
| `data-swb-color-secondary` | hex | `#dc3545` |
| `data-swb-cart` | boolean | `true` |
| `data-swb-cart-floating` | boolean | `false` |
| `data-swb-checkout-title` | string | `"Your Cart"` |
| `data-swb-enable-billing` | boolean | `true` |
| `data-swb-billing-title` | string | `"Billing Details"` |
| `data-swb-submit-text` | string | `"Proceed to WhatsApp"` |
| `data-swb-custom-fields` | JSON | `[]` |

### Product
| Attribute | Type |
|---|---|
| `data-swb-product` | flag (required) |
| `data-swb-product-sku` | string (required) |
| `data-swb-product-name` | string (required) |
| `data-swb-product-price` | number (required) |
| `data-swb-product-link` | URL |
| `data-swb-product-link-title` | string |
| `data-swb-product-add-cart-title` | string |
| `data-swb-product-description` | flag |
| `data-swb-product-buttons` | flag (required) |

### Standalone components
- `data-swb-cart` (standalone cart button) with `data-swb-store-id`, `data-swb-store`, `data-swb-whatsapp`, `data-swb-currency`
- `data-swb-cart-count` (badge element)
- `data-swb-product-sku` + `data-swb-product-name` + `data-swb-product-price` on any button for standalone add-to-cart

## Focus Areas

- Multi-store cart isolation via `storeId` key
- localStorage persistence, cart count sync across components
- WhatsApp message composition: line items, quantities, totals, billing fields, custom fields
- Cart totals: use `calculateCartTotal(cart)` for modal and WhatsApp totals
- Product filtering (search by name/SKU), sorting (alpha, price)
- Floating cart UI, checkout modal, empty states
- Currency formatting for 15+ currencies (USD, EUR, GBP, JPY, MYR, etc.)

## Implementation Guidance

- Preserve backward compatibility for all documented attributes, class names, and export names
- Test multi-store isolation: carts must not bleed between storeIds
- Verify WhatsApp message format includes all billing and custom field data
- Keep price and quantity math numeric; product attributes may arrive as strings
- Keep examples copy-pasteable; update README on API changes

## Validation

```bash
npm run build
npm test        # when available
```
