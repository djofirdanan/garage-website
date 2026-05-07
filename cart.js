/* =========================================================
   GARAGE – Cart Engine (localStorage)
   ========================================================= */

const CART_KEY = 'garage_cart_v2';
const FREE_SHIP_THRESHOLD = 250;
const SHIP_COST = 35;
const BIT_PHONE = '050-9723636';
const WA_PHONE  = '972509723636';

/* ---- CRUD ---- */
function cartGet() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function cartSave(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  cartBadgeUpdate();
}

function cartAdd(productId, opts = {}) {
  const p = PRODUCTS[productId];
  if (!p) return;

  const items = cartGet();
  const uid   = `${productId}_${opts.scent || 'none'}_${Date.now()}`;

  // Determine price (handle priceVariants for bottles)
  let price = p.price;
  if (p.priceVariants && opts.qty) {
    const match = p.priceVariants.find(v => v.qty === opts.qty);
    if (match) price = match.price;
  }

  items.push({
    uid,
    productId,
    name: p.name,
    img:  p.img,
    price,
    scent: opts.scent || null,
    qty:   opts.qty   || 1,
    isUpsell: opts.isUpsell || false,
  });

  cartSave(items);
  cartToast(`"${p.name}" נוסף לסל`);
}

function cartAddUpsell(upsellId, scent) {
  const u = UPSELLS[upsellId];
  if (!u) return;

  const items = cartGet();
  const uid   = `upsell_${upsellId}_${Date.now()}`;

  items.push({
    uid,
    productId: upsellId,
    name:  u.name,
    img:   u.img,
    price: u.bundlePrice,
    scent: scent || null,
    qty:   u.qty || 1,
    isUpsell: true,
    bundleSaving: u.standAlonePrice - u.bundlePrice,
  });

  cartSave(items);
  cartToast(`"${u.name}" נוסף לסל!`);
}

function cartRemove(uid) {
  const items = cartGet().filter(i => i.uid !== uid);
  cartSave(items);
}

function cartUpdateQty(uid, delta) {
  const items = cartGet();
  const item  = items.find(i => i.uid === uid);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  cartSave(items);
}

function cartClear() {
  localStorage.removeItem(CART_KEY);
  cartBadgeUpdate();
}

/* ---- Calculations ---- */
function cartTotals() {
  const items    = cartGet();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_COST;
  const savings  = items.reduce((s, i) => s + (i.bundleSaving || 0) * i.qty, 0);
  // Count original-price savings too
  const saleSave = items.reduce((s, i) => {
    const p = PRODUCTS[i.productId];
    if (p && p.origPrice) return s + (p.origPrice - p.price) * i.qty;
    return s;
  }, 0);
  return { subtotal, shipping, total: subtotal + shipping, savings, saleSave };
}

function cartCount() {
  return cartGet().reduce((s, i) => s + i.qty, 0);
}

/* ---- UI helpers ---- */
function cartBadgeUpdate() {
  const cnt = cartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = cnt;
    el.style.display = cnt > 0 ? 'flex' : 'none';
  });
}

function cartToast(msg) {
  let t = document.getElementById('garage-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'garage-toast';
    t.className = 'garage-toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${msg}`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---- WhatsApp order message ---- */
function buildOrderMessage(customerName, phone, address, notes, payMethod, finalTotal) {
  const items  = cartGet();
  const totals = cartTotals();
  const total  = finalTotal ?? totals.total;

  const pmLabels = { bit: 'ביט', paybox: 'PayBox', bank: 'העברה בנקאית', cash: 'מזומן' };

  let msg = `הזמנה חדשה מ-GARAGE\n\n`;
  msg += `שם: ${customerName}\nטלפון: ${phone}\nכתובת: ${address}\n`;
  if (notes) msg += `הערות: ${notes}\n`;
  msg += `\nמוצרים:\n`;
  items.forEach(i => {
    msg += `• ${i.name}`;
    if (i.scent) msg += ` [${i.scent}]`;
    if (i.qty > 1) msg += ` x${i.qty}`;
    msg += ` — ₪${(i.price * i.qty).toLocaleString('he-IL')}\n`;
  });
  msg += `\nסכום: ₪${totals.subtotal.toLocaleString('he-IL')}`;
  msg += totals.shipping === 0 ? `\nמשלוח: חינם!` : `\nמשלוח: ₪${totals.shipping}`;
  msg += `\n\nסה"כ לתשלום: ₪${total.toLocaleString('he-IL')}`;

  const pm = payMethod || 'bit';
  if (pm === 'bit') {
    msg += `\n\nתשלום בביט למספר: ${BIT_PHONE}`;
  } else if (pm === 'paybox') {
    msg += `\n\nתשלום דרך PayBox`;
  } else if (pm === 'bank') {
    msg += `\n\nתשלום בהעברה בנקאית`;
  } else if (pm === 'cash') {
    msg += `\n\nתשלום במזומן בעת קבלת ההזמנה`;
  }

  return encodeURIComponent(msg);
}

/* ---- Smart upsell suggestion ---- */
function getCartUpsells() {
  const items       = cartGet();
  const inCart      = new Set(items.map(i => i.productId));
  const suggestions = [];

  // If any diffuser is in cart, suggest bottle
  const hasDiffuser = items.some(i => {
    const p = PRODUCTS[i.productId];
    return p && ['car','g30','g60','g100','ipad','s500','s1000'].includes(i.productId);
  });
  if (hasDiffuser && !inCart.has('bottles_100ml') && !inCart.has('bottle-1')) {
    suggestions.push('bottle-1');
  }

  // If diffuser for home, suggest annual
  const hasHomeDiffuser = items.some(i =>
    ['g30','g60','g100','ipad','bundle'].includes(i.productId)
  );
  if (hasHomeDiffuser && !inCart.has('annual-6')) {
    suggestions.push('annual-6');
  }

  // Always offer samples if not there
  if (!inCart.has('samples') && suggestions.length < 2) {
    suggestions.push('samples');
  }

  // Laundry as low-ticket add-on
  if (!inCart.has('laundry') && suggestions.length < 2) {
    suggestions.push('laundry');
  }

  return [...new Set(suggestions)].slice(0, 2);
}

/* ---- Init on page load ---- */
document.addEventListener('DOMContentLoaded', () => {
  cartBadgeUpdate();
});
