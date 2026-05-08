/* =========================================================
   GARAGE – Shared site components (nav, cart sidebar, footer)
   Inject into pages via <div id="siteHeader"> / <div id="siteFooter">
   ========================================================= */
(function () {
  const LOGO = 'imgs/logo.png';
  const WA   = 'https://wa.me/972509723636';
  const IG   = 'https://www.instagram.com/garage_scents';

  /* ── Global helpers (defined immediately for inline onclick) ── */
  window.openCart = function () {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartSidebar')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeCart = function () {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartSidebar')?.classList.remove('open');
    document.body.style.overflow = '';
  };
  window.openMobileNav = function () {
    document.getElementById('mobileNav')?.classList.add('open');
    document.getElementById('mobileNavOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeMobileNav = function () {
    document.getElementById('mobileNav')?.classList.remove('open');
    document.getElementById('mobileNavOverlay')?.classList.remove('open');
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
  <div class="cart-items" id="cartItems">
    <div class="cart-empty">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span>הסל ריק</span>
    </div>
  </div>
  <div class="cart-footer">
    <div class="cart-totals">
      <div class="cart-total-row"><span>סכום ביניים</span><span id="cartSubtotal">₪0</span></div>
      <div class="cart-total-row"><span>משלוח</span><span id="cartShipping">חינם מ-₪250</span></div>
      <div class="cart-total-row total"><span>סה"כ</span><span id="cartTotal">₪0</span></div>
    </div>
    <button class="cart-checkout-btn" onclick="location.href='checkout.html'">המשך לתשלום</button>
    <p class="cart-free-ship">משלוח חינם בהזמנות מעל <span>₪250</span></p>
  </div>
</div>`;
  }

  function announcementHTML() {
    return `
<div class="announcement-bar">
  <div class="announcement-bar__inner">
    <span>משלוח חינם מ-250 שח</span>
    <span class="announcement-bar__sep">|</span>
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
    <a href="index.html" class="site-nav__logo">
      <img src="${LOGO}" alt="GARAGE" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <strong style="display:none;font-size:20px;font-weight:900;letter-spacing:.06em">GARAGE</strong>
    </a>
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
<div class="cnav-overlay" id="mobileNavOverlay" onclick="closeMobileNav()"></div>
<div class="cnav" id="mobileNav">
  <div class="cnav__curve-strip" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100" preserveAspectRatio="none">
      <path d="M60 0 L0 0 C30 25,30 75,0 100 L60 100 Z" fill="#0f0f0f"/>
    </svg>
  </div>
  <div class="cnav__panel">
    <nav class="cnav__links">
      <a href="index.html" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">01</span>
        <span class="cnav__text"><span>ד</span><span>פ</span><span> </span><span>ה</span><span>ב</span><span>י</span><span>ת</span></span>
      </a>
      <a href="category.html?cat=car" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">02</span>
        <span class="cnav__text"><span>ל</span><span>ר</span><span>כ</span><span>ב</span></span>
      </a>
      <a href="category.html?cat=home" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">03</span>
        <span class="cnav__text"><span>ל</span><span>ב</span><span>י</span><span>ת</span></span>
      </a>
      <a href="category.html?cat=biz" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">04</span>
        <span class="cnav__text"><span>ל</span><span>ע</span><span>ס</span><span>ק</span></span>
      </a>
      <a href="category.html?cat=bottles" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">05</span>
        <span class="cnav__text"><span>ב</span><span>ק</span><span>ב</span><span>ו</span><span>ק</span><span>י</span><span>ם</span></span>
      </a>
      <a href="subscriptions.html" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">06</span>
        <span class="cnav__text"><span>מ</span><span>נ</span><span>ו</span><span>י</span><span>י</span><span>ם</span></span>
      </a>
      <a href="index.html#contact" class="cnav__link" onclick="closeMobileNav()">
        <span class="cnav__num">07</span>
        <span class="cnav__text"><span>צ</span><span>ו</span><span>ר</span><span> </span><span>ק</span><span>ש</span><span>ר</span></span>
      </a>
    </nav>
    <div class="cnav__footer">
      <a href="${WA}" target="_blank" rel="noopener" class="cnav__footer-link" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
      <a href="${IG}" target="_blank" rel="noopener" class="cnav__footer-link" aria-label="אינסטגרם">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href="tel:050-9723636" class="cnav__footer-link" aria-label="050-9723636">
        <svg viewBox="0 0 256 256" fill="currentColor" width="22" height="22"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.72a7.93,7.93,0,0,0,.56-.75,16,16,0,0,0,1.36-15.19l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/></svg>
      </a>
      <a href="category.html?cat=car" class="cnav__footer-cta" onclick="closeMobileNav()">לקנות עכשיו</a>
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
        <img src="${LOGO}" alt="GARAGE" onerror="this.style.display='none'">
        <p>מפיצי ריח ומוצרי ריח איכותיים לבית, לרכב ולעסק.</p>
        <div class="footer-socials">
          <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph-fill ph-instagram-logo"></i></a>
          <a href="https://www.facebook.com/garage.org.il" target="_blank" rel="noopener" aria-label="Facebook"><i class="ph-fill ph-facebook-logo"></i></a>
          <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph-fill ph-whatsapp-logo"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">קטגוריות</p>
        <ul>
          <li><a href="category.html?cat=car">מפיצים לרכב</a></li>
          <li><a href="category.html?cat=home">מפיצים לבית</a></li>
          <li><a href="category.html?cat=biz">מפיצים לעסק</a></li>
          <li><a href="category.html?cat=bottles">בקבוקי ריח</a></li>
          <li><a href="subscriptions.html">מנויים</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-col__title">צור קשר</p>
        <ul>
          <li><a href="tel:0509723636"><i class="ph ph-phone" style="margin-left:6px"></i>050-9723636</a></li>
          <li><span><i class="ph ph-map-pin" style="margin-left:6px"></i>הארום 82, נתיבות</span></li>
          <li><a href="${WA}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo" style="margin-left:6px"></i>וואטסאפ</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 GARAGE — כל הזכויות שמורות</p>
      <div style="display:flex;gap:20px">
        <a href="#">תקנון</a>
        <a href="#">פרטיות</a>
        <a href="#">נגישות</a>
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
    document.getElementById('navHamburger')?.addEventListener('click', openMobileNav);

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
