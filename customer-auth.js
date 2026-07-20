/* GARAGE storefront - customer auth client (cross-origin to admin API) */
(function () {
  const ADMIN_API = 'https://garage-admin.vercel.app';
  const TOKEN_KEY = 'garage_customer_token';
  const CUSTOMER_KEY = 'garage_customer';

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function setToken(t) { try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {} }
  function clearToken() { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} }

  function getCustomer() {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setCustomer(c) {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c)); } catch (e) {}
  }
  function clearCustomer() { try { localStorage.removeItem(CUSTOMER_KEY); } catch (e) {} }

  async function apiFetch(path, opts) {
    opts = opts || {};
    const headers = Object.assign({}, opts.headers || {});
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const res = await fetch(ADMIN_API + path, Object.assign({}, opts, {
      headers,
      credentials: 'include',
    }));
    return res;
  }

  function requireAuth() {
    if (!getToken()) {
      if (window.GarageAuthModal) {
        GarageAuthModal.open('login');
      } else {
        const ret = encodeURIComponent(location.pathname + location.search);
        location.href = 'login.html?return=' + ret;
      }
      return false;
    }
    return true;
  }

  async function logout() {
    try { await apiFetch('/api/storefront/auth/logout', { method: 'POST' }); } catch (e) {}
    clearToken(); clearCustomer();
    location.href = 'index.html';
  }

  const USER_SVG = '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>';

  function renderNavSlot() {
    const slot = document.getElementById('navCustomerSlot');
    if (!slot) return;
    const customer = getCustomer();
    if (!customer) {
      if (window.GarageAuthModal) {
        slot.innerHTML = '<button class="site-nav__icon-btn" aria-label="התחבר" title="התחבר" onclick="GarageAuthModal.open(\'login\')">' + USER_SVG + '</button>';
      } else {
        slot.innerHTML = '<a href="login.html" class="site-nav__icon-btn" aria-label="התחבר" title="התחבר">' + USER_SVG + '</a>';
      }
    } else {
      const firstName = (customer.name || '').split(' ')[0] || 'חשבון';
      slot.innerHTML =
        '<div class="nav-customer">' +
          '<button class="nav-customer__btn site-nav__icon-btn" id="navCustomerBtn" aria-label="חשבון">' +
            USER_SVG +
            '<span class="nav-customer__name">' + firstName + '</span>' +
          '</button>' +
          '<div class="nav-customer__menu" id="navCustomerMenu" hidden>' +
            '<a href="account.html">החשבון שלי</a>' +
            '<a href="account.html#orders">ההזמנות שלי</a>' +
            '<button type="button" id="navCustomerLogout">התנתק</button>' +
          '</div>' +
        '</div>';
      const btn = document.getElementById('navCustomerBtn');
      const menu = document.getElementById('navCustomerMenu');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
      });
      document.addEventListener('click', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) menu.hidden = true;
      });
      const lo = document.getElementById('navCustomerLogout');
      lo.addEventListener('click', function (e) { e.preventDefault(); logout(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavSlot);
  } else {
    renderNavSlot();
  }

  window.GarageAuth = {
    ADMIN_API: ADMIN_API,
    getToken: getToken, setToken: setToken, clearToken: clearToken,
    getCustomer: getCustomer, setCustomer: setCustomer, clearCustomer: clearCustomer,
    apiFetch: apiFetch, requireAuth: requireAuth, logout: logout,
    renderNavSlot: renderNavSlot,
  };
})();
