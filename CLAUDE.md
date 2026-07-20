# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This Is a Vanilla Static Site

No build step. HTML + CSS + JS only. **Does NOT auto-deploy from git push** — must run:

```bash
vercel deploy --prod --yes   # from D:\website-claude\garage\
```

The admin panel lives separately at `D:\website-claude\garage-admin\` (Next.js, auto-deploys from GitHub push).

## URLs

- Storefront: `https://garage-beryl-sigma.vercel.app`
- Admin: `https://garage-admin.vercel.app`
- Order tracking: `https://garage-beryl-sigma.vercel.app/order-tracking.html?id={orderId}`

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — all sections inline (hero, products, categories, testimonials, contact) |
| `style.css` | All styles, single file |
| `products.js` | Product data + card rendering. Injected into `#productGrid` |
| `scents-data.js` | 18 scent definitions (name, family, notes, color) |
| `site-components.js` | Shared header/footer injected into every page |
| `cart.js` | Cart logic (localStorage) |
| `customer-auth.js` | Customer login/register (calls admin API) |

## Key Architecture Notes

- **No framework** - all JS is vanilla, DOM manipulation, `fetch()` for API calls
- **Admin API** at `https://garage-admin.vercel.app/api/` handles orders, customers, products
- **Cardcom** payment integration - success redirects to `checkout-success.html`
- **Animations** - split-text letter reveal via `IntersectionObserver`, testimonials carousel, smoke canvas background
- **Split-text animation** handles only plain text — the JS splits `.innerHTML` by words/chars. Never put HTML tags (`<br>`, `<span>`) inside `.section__title` or `.anim-testi__title` elements; use CSS for line breaks instead
- **RTL** - all Hebrew, `dir="rtl"` on `<html>`
- **Icons** - inline SVG only (no icon library)
- **Images** in `imgs/` — product images: `g30/g60/g100/s300/s600/s800-diffuser.png`, `aircules-car.png`, `bottles-3-large.png`

## Analytics & Pixels

- GA4: `G-QCF6M9RK2S`
- Facebook Pixel: `471764037206333`
- Both initialized inline in `index.html` `<head>`
