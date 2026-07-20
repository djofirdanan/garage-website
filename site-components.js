/* =========================================================
   GARAGE – Shared site components (nav, cart sidebar, footer)
   Inject into pages via <div id="siteHeader"> / <div id="siteFooter">
   ========================================================= */

/* ── Analytics & Tracking ───────────────────────────────── */
(function injectTracking() {
  // Google Analytics 4
  const gaEl = document.createElement('script');
  gaEl.async = true;
  gaEl.src   = 'https://www.googletagmanager.com/gtag/js?id=G-QCF6M9RK2S';
  document.head.appendChild(gaEl);
  const gaInit = document.createElement('script');
  gaInit.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QCF6M9RK2S');
  `;
  document.head.appendChild(gaInit);

  // Facebook Pixel - ID: 471764037206333
  // Conversion API token (server-side): EAAPA5s8HmX8BO8Eb3ZAu6gadEZAmGW3mMPd8JSV11rm9bBF0TUdsb0g0XleZBCOkBG3ZBBjQRA2TzzvXxU2XJjitNGNb16tRNz5l6tQfpBSM6GebDCHUVrRqZA0HawNUliKXLVaBzmQsOGg6RqjOWur5PZBwDgeENVbHFZABRmfPZCZAEoOHZCzqMY3mNGZAeNHg3wYZCAZDZD
  const fbEl = document.createElement('script');
  fbEl.textContent = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','471764037206333');
    fbq('track','PageView');
  `;
  document.head.appendChild(fbEl);
  // fbq noscript fallback
  const fbNs = document.createElement('noscript');
  fbNs.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=471764037206333&ev=PageView&noscript=1"/>';
  document.head.appendChild(fbNs);
})();

/* ── Pixel helpers (called from cart.js / checkout.html) ── */
window.pixelAddToCart = function(name, price) {
  if (typeof fbq !== 'undefined') fbq('track', 'AddToCart', { content_name: name, value: price, currency: 'ILS' });
  if (typeof gtag !== 'undefined') gtag('event', 'add_to_cart', { currency: 'ILS', value: price, items: [{ item_name: name }] });
};
window.pixelInitCheckout = function(value) {
  if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', { value, currency: 'ILS' });
  if (typeof gtag !== 'undefined') gtag('event', 'begin_checkout', { currency: 'ILS', value });
};
window.pixelPurchase = function(value, orderId) {
  if (typeof fbq !== 'undefined') fbq('track', 'Purchase', { value, currency: 'ILS', order_id: orderId });
  if (typeof gtag !== 'undefined') gtag('event', 'purchase', { currency: 'ILS', value, transaction_id: orderId });
};

(function () {
  const LOGO = 'imgs/logo.png';
  const WA   = 'https://wa.me/972509723636';
  const IG   = 'https://www.instagram.com/garage_scents';

  /* ── Global helpers (defined immediately for inline onclick) ── */
  window.openCart = function () {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartSidebar')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof cartSidebarRender === 'function') cartSidebarRender();
  };
  window.closeCart = function () {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartSidebar')?.classList.remove('open');
    document.body.style.overflow = '';
  };
  window.openMobileNav = function () {
    document.getElementById('mobileNav')?.classList.add('open');
    document.getElementById('mobileNavOverlay')?.classList.add('open');
    document.getElementById('navHamburger')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeMobileNav = function () {
    document.getElementById('mobileNav')?.classList.remove('open');
    document.getElementById('mobileNavOverlay')?.classList.remove('open');
    document.getElementById('navHamburger')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── HTML builders ── */
  function cartSidebarHTML() {
    return `
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-sidebar" id="cartSidebar">
  <div class="cart-header">
    <h2>הסל שלי (<span id="cartCount">0</span>)</h2>
    <button class="cart-close" onclick="closeCart()">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  <div class="cart-items" id="cartSidebarItems">
    <div class="cart-empty" id="cartSidebarEmpty">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span>הסל ריק</span>
    </div>
  </div>
  <div id="cartUpsellStrip" style="display:none"></div>
  <div class="cart-footer">
    <div class="cart-totals">
      <div class="cart-total-row"><span>סכום ביניים</span><span id="cartSubtotal">₪0</span></div>
      <div class="cart-total-row"><span>משלוח</span><span id="cartShipping">₪35</span></div>
      <div class="cart-total-row total"><span>סה"כ</span><span id="cartTotal">₪0</span></div>
    </div>
    <button class="cart-checkout-btn" onclick="location.href='checkout.html'">המשך לתשלום</button>
    <p class="cart-free-ship">אספקה תוך 2-4 ימי עסקים</p>
  </div>
</div>`;
  }

  function announcementHTML() {
    return `
<div class="announcement-bar">
  <div class="announcement-bar__inner">
    <span>18 ניחוחות יוקרתיים</span>
    <span class="announcement-bar__sep">|</span>
    <span>שמן טהור בלבד</span>
    <span class="announcement-bar__sep">|</span>
    <a href="tel:050-9723636">050-9723636</a>
  </div>
</div>`;
  }

  function navHTML() {
    return `
<nav class="site-nav">
  <div class="site-nav__inner">
    <div class="site-nav__start">
      <a href="index.html" class="site-nav__logo">
        <img src="${LOGO}" alt="GARAGE" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <strong style="display:none;font-size:20px;font-weight:900;letter-spacing:.06em">GARAGE</strong>
      </a>
      <nav class="site-nav__links" id="siteNavLinks">
        <a href="index.html">דף הבית</a>
        <a href="category.html?cat=car">לרכב</a>
        <a href="category.html?cat=home">לבית</a>
        <a href="category.html?cat=biz">לעסק</a>
        <a href="category.html?cat=bottles">בקבוקים</a>
        <a href="index.html#contact">צור קשר</a>
        <a href="subscriptions.html" class="site-nav__sub-cta">מנויים</a>
      </nav>
      <button class="nav-hamburger" id="navHamburger" aria-label="תפריט">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="site-nav__end">
      <div id="navCustomerSlot"></div>
      <button class="site-nav__icon-btn" onclick="openCart()" aria-label="סל קניות">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span class="cart-badge" id="navCartBadge" style="display:none">0</span>
      </button>
    </div>
  </div>
</nav>`;
  }

  function mobileNavHTML() {
    return `
<div class="mnav-overlay" id="mobileNavOverlay" onclick="closeMobileNav()"></div>
<div class="mnav" id="mobileNav" role="dialog" aria-modal="true" aria-label="תפריט">
  <div class="mnav__handle" onclick="closeMobileNav()" aria-hidden="true"></div>
  <nav class="mnav__links">
    <a href="index.html"             class="mnav__link" onclick="closeMobileNav()"><span>דף הבית</span><i class="ph ph-arrow-left"></i></a>
    <a href="category.html?cat=car"  class="mnav__link" onclick="closeMobileNav()"><span>לרכב</span><i class="ph ph-arrow-left"></i></a>
    <a href="category.html?cat=home" class="mnav__link" onclick="closeMobileNav()"><span>לבית</span><i class="ph ph-arrow-left"></i></a>
    <a href="category.html?cat=biz"  class="mnav__link" onclick="closeMobileNav()"><span>לעסק</span><i class="ph ph-arrow-left"></i></a>
    <a href="category.html?cat=bottles" class="mnav__link" onclick="closeMobileNav()"><span>בקבוקים</span><i class="ph ph-arrow-left"></i></a>
    <a href="subscriptions.html"     class="mnav__link mnav__link--accent" onclick="closeMobileNav()"><span>מנויים</span><i class="ph ph-arrow-left"></i></a>
    <a href="index.html#contact"     class="mnav__link" onclick="closeMobileNav()"><span>צור קשר</span><i class="ph ph-arrow-left"></i></a>
  </nav>
  <div class="mnav__foot">
    <a href="${WA}" class="mnav__cta" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      דברו איתנו בוואטסאפ
    </a>
    <div class="mnav__socials">
      <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph-fill ph-instagram-logo"></i></a>
      <a href="https://www.facebook.com/garage.org.il" target="_blank" rel="noopener" aria-label="Facebook"><i class="ph-fill ph-facebook-logo"></i></a>
      <a href="tel:050-9723636" aria-label="050-9723636"><i class="ph-fill ph-phone"></i></a>
    </div>
  </div>
</div>`;
  }

  function footerHTML() {
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="${LOGO}" alt="GARAGE - מפיצי ריח איכותיים" onerror="this.style.display='none'">
        <p>מפיצי ריח ומוצרי ריח איכותיים לבית, לרכב ולעסק. שמן ריח טהור 100% ב-18 ניחוחות יוקרתיים.</p>
        <div class="footer-rating">
          <span class="footer-rating__stars">★★★★★</span>
          <span class="footer-rating__text">+200 ביקורות 5 כוכבים בגוגל</span>
        </div>
        <div class="footer-socials">
          <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram GARAGE"><i class="ph-fill ph-instagram-logo"></i></a>
          <a href="https://www.facebook.com/garage.org.il" target="_blank" rel="noopener" aria-label="Facebook GARAGE"><i class="ph-fill ph-facebook-logo"></i></a>
          <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp GARAGE"><i class="ph-fill ph-whatsapp-logo"></i></a>
          <a href="https://www.tiktok.com/@garage_scents" target="_blank" rel="noopener" aria-label="TikTok GARAGE"><i class="ph-fill ph-tiktok-logo"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">מוצרים</p>
        <ul>
          <li><a href="category.html?cat=car">מפיצי ריח לרכב</a></li>
          <li><a href="category.html?cat=home">מפיצי ריח לבית</a></li>
          <li><a href="category.html?cat=biz">מפיצי ריח לעסק</a></li>
          <li><a href="category.html?cat=bottles">בקבוקי שמן ריח</a></li>
          <li><a href="category.html?cat=extra">תוספות ואקסטרות</a></li>
          <li><a href="subscriptions.html">מנוי ריח חודשי</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">מידע</p>
        <ul>
          <li><a href="index.html#how-it-works">איך זה עובד?</a></li>
          <li><a href="index.html#testimonials">ביקורות לקוחות</a></li>
          <li><a href="index.html#products">מוצרים נמכרים</a></li>
          <li><a href="cart.html">סל קניות</a></li>
          <li><a href="account.html">אזור אישי</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">צור קשר</p>
        <ul>
          <li><a href="tel:0509723636"><i class="ph ph-phone" style="margin-left:6px"></i>050-9723636</a></li>
          <li><a href="${WA}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo" style="margin-left:6px"></i>שלח הודעה בוואטסאפ</a></li>
          <li><span><i class="ph ph-clock" style="margin-left:6px"></i>א'-ה' 9:00-18:00</span></li>
          <li><span><i class="ph ph-map-pin" style="margin-left:6px"></i>הארום 82, נתיבות</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 GARAGE | מפיצי ריח איכותיים לבית, רכב ועסק - כל הזכויות שמורות</p>
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <a href="#">תקנון ומדיניות החזרות</a>
        <a href="#">מדיניות פרטיות</a>
        <a href="#">הצהרת נגישות</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  /* ── Injection on DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {
    const headerSlot = document.getElementById('siteHeader');
    if (headerSlot) {
      headerSlot.innerHTML =
        cartSidebarHTML() + announcementHTML() + navHTML() + mobileNavHTML();
    }

    const footerSlot = document.getElementById('siteFooter');
    if (footerSlot) {
      footerSlot.innerHTML = footerHTML();
    }

    /* hamburger */
    document.getElementById('navHamburger')?.addEventListener('click', function () {
      document.getElementById('mobileNav')?.classList.contains('open')
        ? closeMobileNav()
        : openMobileNav();
    });

    /* active nav highlight */
    const page = location.pathname.split('/').pop() || 'index.html';
    const cat  = new URLSearchParams(location.search).get('cat') || '';
    document.querySelectorAll('.site-nav__links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const match = href.includes(page) && (cat ? href.includes('cat=' + cat) : true);
      if (match && page !== 'index.html') a.classList.add('active');
    });

    /* refresh cart badge if cart.js already loaded */
    if (typeof cartBadgeUpdate === 'function') cartBadgeUpdate();

    /* re-init customer auth slot if customer-auth.js already ran */
    if (window.GarageAuth && typeof window.GarageAuth.renderNavSlot === 'function') {
      window.GarageAuth.renderNavSlot();
    }
  });
})();
