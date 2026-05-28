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
