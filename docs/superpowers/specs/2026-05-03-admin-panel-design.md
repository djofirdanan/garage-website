# GARAGE Admin Panel — Design Spec
**Date:** 2026-05-03  
**Status:** Approved

---

## Overview

A standalone Next.js admin application for managing the GARAGE fragrance storefront. Deployed as a separate Vercel project (`garage-admin.vercel.app`) sharing the same Vercel KV instance as the storefront. Includes full order management, customer CRM, product/upsell editing, coupons, promotions, reports, and two-way WhatsApp communication via Green API.

The existing storefront (`garage-beryl-sigma.vercel.app`) remains in plain HTML/CSS/JS with minimal changes to capture orders and validate coupons.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts (via shadcn/ui) |
| Database | Vercel KV (Redis) |
| Auth | JWT in httpOnly cookies |
| WhatsApp | Green API |
| Deployment | Vercel (separate project) |

---

## Architecture

```
garage-admin/              ← New Next.js project
  app/
    (auth)/
      login/page.tsx
    (admin)/
      layout.tsx           ← sidebar + auth guard
      page.tsx             ← dashboard
      orders/
        page.tsx
        [id]/page.tsx
      customers/
        page.tsx
        [phone]/page.tsx
      products/page.tsx
      coupons/page.tsx
      promotions/page.tsx
      reports/page.tsx
      messages/page.tsx
      users/page.tsx
    api/
      auth/login/route.ts
      auth/logout/route.ts
      auth/me/route.ts
      orders/route.ts
      orders/[id]/route.ts
      customers/route.ts
      customers/[phone]/route.ts
      coupons/route.ts
      coupons/validate/route.ts
      coupons/[code]/route.ts
      products/overrides/route.ts
      promotions/route.ts
      promotions/[id]/route.ts
      reports/summary/route.ts
      reports/revenue/route.ts
      reports/products/route.ts
      whatsapp/send/route.ts
      whatsapp/webhook/route.ts
      whatsapp/messages/[phone]/route.ts
      users/route.ts
      users/[id]/route.ts
  lib/
    kv.ts                  ← Vercel KV helpers
    auth.ts                ← JWT sign/verify
    green-api.ts           ← Green API client
  components/
    ui/                    ← shadcn/ui components
    orders-table.tsx
    customer-card.tsx
    whatsapp-chat.tsx
    stats-card.tsx
    revenue-chart.tsx
```

**Storefront changes (garage repo):**
- `checkout.html` — POST to `/api/orders` before opening WhatsApp
- `cart.html` — coupon input field + GET `/api/coupons/validate`
- `products.js` — on load, fetch `/api/products/overrides` and merge with static data

---

## Vercel KV Schema

```
admin_users                      → JSON[]   array of admin user objects
sessions:{token}                 → string   admin user ID, TTL 24h

orders                           → ZSET     order IDs scored by timestamp
order:{id}                       → JSON     full order object

customers:{phone}                → JSON     customer object
customers_index                  → ZSET     phone numbers scored by lastOrderAt

coupons                          → HASH     code → coupon JSON
coupon_uses:{code}               → ZSET     order IDs that used this coupon

promotions                       → JSON[]   array of promotion objects

products_override                → JSON     { [productId]: partial product fields }

messages:{phone}                 → JSON[]   WhatsApp message history, latest 200
```

---

## Data Models

### Order
```ts
{
  id: string               // "ord_1746123456789"
  createdAt: number        // unix timestamp
  status: "new" | "confirmed" | "shipped" | "cancelled"
  customer: {
    name: string
    phone: string          // "0509723636"
    address: string
    city: string
    zip?: string
  }
  items: Array<{
    productId: string
    name: string
    scent?: string
    qty: number
    price: number
    isUpsell: boolean
  }>
  subtotal: number
  shipping: number         // 0 = free
  discountAmt: number      // from coupon
  couponCode?: string
  total: number
  notes?: string
}
```

### Customer
```ts
{
  phone: string
  name: string
  firstOrderAt: number
  lastOrderAt: number
  totalSpent: number
  orderCount: number
  orderIds: string[]
}
```

### Coupon
```ts
{
  code: string             // "SAVE10"
  type: "percent" | "fixed"
  value: number            // 10 = 10% or ₪10
  minOrder?: number        // minimum subtotal
  maxUses?: number         // null = unlimited
  usedCount: number
  expiresAt?: number       // unix timestamp, null = no expiry
  productIds?: string[]    // empty = all products
  active: boolean
}
```

### Promotion
```ts
{
  id: string
  title: string
  type: "category_discount" | "buy_x_get_y" | "banner"
  value?: number           // discount percent
  category?: string        // "car" | "home" | "business"
  bannerText?: string      // for banner type
  startAt: number
  endAt: number
  active: boolean
}
```

### Admin User
```ts
{
  id: string               // "usr_1746123456789"
  email: string
  passwordHash: string     // bcrypt
  name: string
  role: "owner" | "editor"
  createdAt: number
}
```

### WhatsApp Message
```ts
{
  id: string
  direction: "in" | "out"
  content: string
  timestamp: number
  status?: "sent" | "delivered" | "read"
}
```

---

## API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Email + password, returns JWT cookie |
| POST | `/api/auth/logout` | Clears cookie |
| GET | `/api/auth/me` | Returns current user |

### Orders
| Method | Route | Description |
|---|---|---|
| GET | `/api/orders` | List with `?status=`, `?search=`, `?page=` |
| POST | `/api/orders` | Create order (called from storefront) — no auth required |
| GET | `/api/orders/[id]` | Single order |
| PATCH | `/api/orders/[id]` | Update status, notes |

### Customers
| Method | Route | Description |
|---|---|---|
| GET | `/api/customers` | List sorted by lastOrderAt |
| GET | `/api/customers/[phone]` | Profile + order history |

### Coupons
| Method | Route | Description |
|---|---|---|
| GET | `/api/coupons` | List all |
| POST | `/api/coupons` | Create |
| DELETE | `/api/coupons/[code]` | Delete |
| GET | `/api/coupons/validate` | `?code=X&subtotal=Y` — public, no auth |

### Products
| Method | Route | Description |
|---|---|---|
| GET | `/api/products/overrides` | Get all overrides — public, no auth |
| PUT | `/api/products/overrides` | Save overrides (admin only) |

### Promotions
| Method | Route | Description |
|---|---|---|
| GET | `/api/promotions` | List — public, no auth |
| POST | `/api/promotions` | Create |
| PATCH | `/api/promotions/[id]` | Update |
| DELETE | `/api/promotions/[id]` | Delete |

### Reports
| Method | Route | Description |
|---|---|---|
| GET | `/api/reports/summary` | KPI cards: today/month revenue, order count |
| GET | `/api/reports/revenue` | `?period=30d|6m|1y` time series |
| GET | `/api/reports/products` | Top products by revenue |

### WhatsApp
| Method | Route | Description |
|---|---|---|
| POST | `/api/whatsapp/send` | Send message to customer |
| POST | `/api/whatsapp/webhook` | Receive incoming messages from Green API |
| GET | `/api/whatsapp/messages/[phone]` | Chat history |

### Admin Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | List (owner role only) |
| POST | `/api/users` | Create user |
| DELETE | `/api/users/[id]` | Delete (owner only, cannot delete self) |
| PATCH | `/api/users/[id]/password` | Reset password |

---

## Admin Pages

### `/login`
Email + password form. On success: JWT stored in httpOnly cookie, redirect to `/`.

### `/` — Dashboard
- 4 KPI cards: הכנסה היום, הכנסה החודש, הזמנות פתוחות, לקוחות חדשים החודש
- AreaChart: הכנסות 30 יום אחרון
- טבלה: 5 הזמנות אחרונות עם quick-status buttons
- רשימה: 3 מוצרים נמכרים ביותר

### `/orders` — הזמנות
- DataTable עם עמודות: מזהה, תאריך, שם לקוח, טלפון, סכום, סטטוס
- Filters: סטטוס, טווח תאריכים, חיפוש חופשי
- לחיצה על שורה פותחת Sheet (drawer) עם פרטי הזמנה מלאים:
  - רשימת מוצרים + ניחוחות + מחירים
  - כתובת משלוח
  - סטטוס selector + שמירה
  - שדה הערות
  - כפתור "שלח הודעה ב-WhatsApp"

### `/customers` — לקוחות
- DataTable: שם, טלפון, הזמנות, סכום כולל, הזמנה אחרונה
- לחיצה פותחת פרופיל לקוח מלא

### `/customers/[phone]` — פרופיל לקוח
- כרטיס סיכום: שם, טלפון, סה"כ קניות, ממוצע הזמנה
- היסטוריית הזמנות
- צ'אט WhatsApp מוטמע (שיחה שלמה + שליחת הודעה)

### `/products` — מוצרים
- טבלת כל 15 המוצרים (מ-products.js)
- עמודות: תמונה, שם, קטגוריה, מחיר נוכחי, מחיר מקורי, badge
- עריכה בפופאפ: מחיר, מחיר מקורי, badge, תיאור, תמונה ראשית
- כרטיסיית "אפסיילים": טבלה נפרדת לעריכת 9 האפסיילים (מחיר bundle, standalone, תמונה)
- שמירה מעדכנת `products_override` ב-KV

### `/coupons` — קופונים
- DataTable: קוד, סוג, ערך, שימושים, תפוגה, סטטוס
- כפתור "צור קופון חדש" → Dialog עם שדות:
  - קוד (או generate אוטומטי)
  - סוג: אחוז / סכום קבוע
  - ערך, הזמנה מינימלית, תאריך תפוגה, שימוש מקסימלי
  - מוצרים ספציפיים (multi-select) או כולם
- מחיקה + toggle active

### `/promotions` — מבצעים
- רשימת מבצעים פעילים ועתידיים
- יצירת מבצע: כותרת, סוג, ערך, קטגוריה, תאריכי תחילה/סיום
- באנר מבצע שמוגדר כאן מופיע בדף הבית (נטען דרך `/api/promotions`)

### `/reports` — דוחות
- BarChart: הכנסות חודשיות (12 חודש)
- PieChart: התפלגות מכירות לפי מוצר
- BarChart: ניחוחות פופולריים
- טבלה: סטטיסטיקות קופונים (כמה פעמים נוצל, כמה חסכון ניתן)

### `/messages` — WhatsApp
- שתי כרטיסיות:
  1. **שיחות** — רשימת כל השיחות לפי לקוח, לחיצה פותחת צ'אט
  2. **קמפיינים** — שליחת הודעה לקבוצה:
     - לכל הלקוחות / לקוחות שקנו מוצר X / לקוחות שלא קנו 30+ יום
     - תבניות שמורות (אפסייל, מבצע, תודה על קנייה)
     - תצוגה מקדימה לפני שליחה

### `/users` — משתמשי אדמין
- רשימת משתמשים: שם, email, תפקיד, תאריך יצירה
- הוספת משתמש: שם, email, סיסמה, תפקיד (owner/editor)
- מחיקה (owner only, לא ניתן למחוק את עצמך)
- Reset password

---

## Auth Flow

1. Login: `POST /api/auth/login` → verify email+password against KV → sign JWT (24h) → set httpOnly cookie
2. Every admin page: middleware checks cookie → verify JWT → if invalid redirect to `/login`
3. API routes: `lib/auth.ts` helper checks cookie on every protected endpoint
4. Role check: `owner` sees `/users` page and can delete users. `editor` cannot.
5. First-run: if `admin_users` key is empty in KV → show setup screen to create first owner account

---

## Green API Integration

**Environment variables:**
```
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_token
ADMIN_WEBHOOK_SECRET=random_string  ← validates incoming webhooks
```

**Sending a message:**
```
POST https://api.green-api.com/waInstance{instanceId}/sendMessage/{token}
{ "chatId": "972509723636@c.us", "message": "..." }
```

**Receiving messages (webhook):**
- Green API dashboard → set webhook URL: `https://garage-admin.vercel.app/api/whatsapp/webhook`
- Incoming payload parsed → message saved to `messages:{phone}` in KV
- Admin UI polls or uses auto-refresh every 10s for new messages

**Auto-message on new order:**
- When `POST /api/orders` is called from storefront → after saving order → send WhatsApp to customer:
  > "שלום {name}, קיבלנו את הזמנתך! ₪{total} - נחזור אליך בקרוב. GARAGE"
- Template configurable in `/messages` settings

---

## Storefront Changes

### checkout.html
Before `window.open(waUrl)`:
```js
await fetch('https://garage-admin.vercel.app/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderPayload)
});
```
If fetch fails — order still goes to WhatsApp (no blocking).

### cart.html
Add coupon section above order summary:
```html
<div class="coupon-row">
  <input id="couponInput" placeholder="קוד קופון" />
  <button onclick="applyCoupon()">החל</button>
</div>
```
`applyCoupon()` calls `GET /api/coupons/validate?code=X&subtotal=Y` → applies discount to totals → passes couponCode into cartTotals.

### products.js
```js
// At end of file, after PRODUCTS definition:
(async () => {
  try {
    const res = await fetch('https://garage-admin.vercel.app/api/products/overrides');
    const overrides = await res.json();
    Object.entries(overrides).forEach(([id, fields]) => {
      if (PRODUCTS[id]) Object.assign(PRODUCTS[id], fields);
    });
  } catch(e) { /* silent fail, use static data */ }
})();
```

---

## Environment Variables (Admin App)

```
KV_REST_API_URL=...          ← from Vercel KV dashboard
KV_REST_API_TOKEN=...
JWT_SECRET=...               ← random 32+ char string
GREEN_API_INSTANCE_ID=...
GREEN_API_TOKEN=...
ADMIN_WEBHOOK_SECRET=...
NEXT_PUBLIC_STOREFRONT_URL=https://garage-beryl-sigma.vercel.app
```

---

## Cardcom Payment Integration

Cardcom is an Israeli payment processor. Integration replaces the manual Bit flow with real credit card processing. Bit remains as an alternative payment option.

**New checkout flow:**
1. Customer fills form in `checkout.html`
2. Clicks "תשלום בכרטיס אשראי" → `POST /api/cardcom/create-payment` with order details
3. API creates order in KV with status `"pending_payment"`, calls Cardcom API to create a payment page
4. Customer redirected to Cardcom hosted payment page
5. After payment: Cardcom calls `POST /api/cardcom/callback` with transaction result
6. Callback handler: updates order status to `"new"` (paid) or `"payment_failed"`, sends WhatsApp confirmation
7. Customer sees success or failure page

**New API routes:**
| Method | Route | Description |
|---|---|---|
| POST | `/api/cardcom/create-payment` | Create Cardcom payment page, returns URL |
| POST | `/api/cardcom/callback` | Cardcom server callback — updates order status |
| GET | `/api/cardcom/success` | Success redirect page |
| GET | `/api/cardcom/cancel` | Cancel/failure redirect page |

**Cardcom data in order:**
```ts
{
  paymentMethod: "cardcom" | "bit"
  cardcomTransactionId?: string
  cardcomStatus?: "paid" | "failed" | "pending"
  last4?: string    // last 4 digits of card
}
```

**Environment variables added:**
```
CARDCOM_TERMINAL_NUMBER=...
CARDCOM_API_NAME=...
CARDCOM_API_PASSWORD=...
```

**Storefront changes:**
- `checkout.html` gets two CTA buttons: "שלם בכרטיס אשראי" (Cardcom) + "שלם בביט" (existing Bit flow)
- Bit flow stays exactly as is — manual payment, WhatsApp order
- Cardcom flow is fully automated — payment confirmed before WhatsApp sent

**Admin — Orders:**
- Orders show payment method badge: כרטיס אשראי / ביט
- Cardcom orders auto-confirmed on payment
- Failed payments visible in orders table with status `"payment_failed"`

---

## Out of Scope

- SMS notifications
- Email notifications
- Inventory/stock management
- Multi-language support
