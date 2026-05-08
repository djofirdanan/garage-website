/* GARAGE — Auth Modal Popup
   Usage: GarageAuthModal.open('login' | 'register')
   Auto-triggers when user-icon in nav is clicked (unauthenticated)
*/
(function () {
  var SLIDES = [
    {
      img: 'https://images.pexels.com/photos/6915261/pexels-photo-6915261.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      alt: 'מפיץ ריח עם אור ורוד',
      tag: 'מנוי חדש',
      title: 'הבית שלך מגיע לריח הכי טוב',
      sub: 'גלה את קולקציית הניחוחות הפרמיום שלנו'
    },
    {
      img: 'https://images.pexels.com/photos/6915313/pexels-photo-6915313.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      alt: 'מפיץ ריח עץ עם אדים',
      tag: 'פרמיום',
      title: 'ריח שמדבר בעד עצמו',
      sub: 'חומרי גלם מהמובחרים בעולם'
    },
    {
      img: 'https://images.pexels.com/photos/6915107/pexels-photo-6915107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      alt: 'מפיץ ריח אטמוספרי',
      tag: 'לבית',
      title: 'אווירה שמתחילה מהריח',
      sub: '18 ניחוחות יוקרתיים לכל סגנון'
    },
    {
      img: 'https://images.pexels.com/photos/6914778/pexels-photo-6914778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      alt: 'מפיץ ריח עץ אלגנטי',
      tag: 'GARAGE',
      title: 'הזמנות מהירות. מעקב קל',
      sub: 'הצטרף לאלפי לקוחות מרוצים'
    }
  ];

  var CSS = `
    #garage-auth-modal-overlay {
      position: fixed; inset: 0; z-index: 9990;
      background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity .25s ease;
    }
    #garage-auth-modal-overlay.open {
      opacity: 1; pointer-events: auto;
    }
    #garage-auth-modal-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      max-width: 900px;
      height: clamp(560px, 78vh, 680px);
      border: 3px solid #111;
      box-shadow: 10px 10px 0 #111;
      border-radius: 6px;
      overflow: hidden;
      background: #fff;
      position: relative;
      transform: scale(.94) translateY(16px);
      transition: transform .28s cubic-bezier(.34,1.56,.64,1), opacity .25s ease;
      opacity: 0;
    }
    #garage-auth-modal-overlay.open #garage-auth-modal-wrap {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    /* Close button */
    #garage-auth-modal-close {
      position: absolute; top: 14px; left: 14px; z-index: 10;
      width: 34px; height: 34px; border-radius: 50%;
      border: none; background: rgba(255,255,255,.9);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,.15);
      transition: background .15s, transform .12s;
      color: #111; font-size: 18px; line-height: 1;
    }
    #garage-auth-modal-close:hover { background: #fff; transform: scale(1.08); }
    /* Image slider */
    .gam-slider {
      position: relative; overflow: hidden; background: #111;
    }
    .gam-track {
      display: flex; width: 100%; height: 100%;
      transition: transform .6s cubic-bezier(.4,0,.2,1);
    }
    .gam-slide {
      min-width: 100%; height: 100%; flex-shrink: 0; position: relative;
    }
    .gam-slide img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .gam-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(10,10,10,.88) 0%, rgba(10,10,10,.15) 55%, transparent 100%);
    }
    .gam-caption {
      position: absolute; bottom: 28px; right: 22px; left: 22px; color: #fff;
    }
    .gam-caption-tag {
      display: inline-block;
      background: #7fffd4; color: #111;
      font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
      padding: 3px 9px; border-radius: 100px; margin-bottom: 8px;
    }
    .gam-caption h3 {
      font-size: 21px; font-weight: 900; line-height: 1.2; margin: 0 0 5px;
    }
    .gam-caption p { font-size: 12px; opacity: .85; margin: 0; }
    .gam-dots {
      position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 5px;
    }
    .gam-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,255,255,.4); border: none; padding: 0; cursor: pointer;
      transition: background .2s, transform .2s;
    }
    .gam-dot.active { background: #fff; transform: scale(1.3); }
    /* Form panel */
    .gam-form-panel {
      display: flex; flex-direction: column; justify-content: center;
      padding: 40px 36px; background: #fff; overflow-y: auto;
    }
    .gam-logo {
      display: flex; align-items: center; margin-bottom: 26px;
    }
    .gam-logo img { height: 32px; object-fit: contain; }
    .gam-tabs {
      display: flex; border: 2.5px solid #111; border-radius: 100px;
      overflow: hidden; margin-bottom: 22px; background: #f4f4f0;
    }
    .gam-tab {
      flex: 1; padding: 9px 0; font-size: 13.5px; font-weight: 700;
      text-align: center; cursor: pointer; border: none; background: transparent;
      color: #888; transition: background .2s, color .2s;
      font-family: 'Noto Sans Hebrew', sans-serif;
    }
    .gam-tab.active { background: #111; color: #fff; border-radius: 100px; }
    .gam-panel { display: none; flex-direction: column; gap: 14px; }
    .gam-panel.active { display: flex; }
    .gam-msg {
      font-size: 12.5px; font-weight: 600; padding: 9px 12px;
      border-radius: 6px; display: none;
    }
    .gam-msg.error { background: #fff0f0; border: 1.5px solid #ffb3b3; color: #c0392b; }
    .gam-msg.success { background: #f0fff8; border: 1.5px solid #7fffd4; color: #1a7a55; }
    .gam-fields { display: flex; flex-direction: column; gap: 12px; }
    .gam-field { display: flex; flex-direction: column; gap: 4px; }
    .gam-field label { font-size: 12px; font-weight: 700; color: #111; }
    .gam-field input {
      width: 100%; padding: 10px 13px; border: 2.5px solid #d0d0d0;
      border-radius: 6px; font-size: 14px; font-family: 'Noto Sans Hebrew', sans-serif;
      color: #111; background: #fff; outline: none; box-sizing: border-box;
      transition: border-color .2s;
    }
    .gam-field input:focus { border-color: #111; }
    .gam-field-pw { position: relative; }
    .gam-field-pw input { padding-left: 40px; }
    .gam-pw-toggle {
      position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; color: #999;
      display: flex; align-items: center; padding: 2px;
    }
    .gam-pw-toggle:hover { color: #111; }
    .gam-optional { font-size: 11px; font-weight: 400; color: #aaa; margin-right: 3px; }
    .gam-submit {
      width: 100%; padding: 12px; background: #111; color: #fff;
      font-size: 14.5px; font-weight: 800; border: 2.5px solid #111;
      border-radius: 6px; cursor: pointer; font-family: 'Noto Sans Hebrew', sans-serif;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background .15s, transform .1s; margin-top: 2px;
    }
    .gam-submit:hover:not(:disabled) { background: #2a2a2a; }
    .gam-submit:active:not(:disabled) { transform: scale(.98); }
    .gam-submit:disabled { opacity: .6; cursor: not-allowed; }
    .gam-spinner {
      width: 15px; height: 15px;
      border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
      border-radius: 50%; animation: gam-spin .65s linear infinite; display: none;
    }
    @keyframes gam-spin { to { transform: rotate(360deg); } }
    .gam-switch { text-align: center; margin-top: 14px; font-size: 12.5px; color: #777; }
    .gam-switch button {
      background: none; border: none; color: #111; font-weight: 700;
      cursor: pointer; font-size: 12.5px; font-family: 'Noto Sans Hebrew', sans-serif;
      text-decoration: underline; text-underline-offset: 2px;
    }
    @media (max-width: 640px) {
      #garage-auth-modal-overlay { padding: 0; align-items: flex-end; }
      #garage-auth-modal-wrap {
        grid-template-columns: 1fr; height: auto; max-height: 92dvh;
        border-radius: 18px 18px 0 0; border-width: 2px;
        box-shadow: 0 -6px 32px rgba(0,0,0,.25);
        transform: translateY(40px); opacity: 0;
      }
      #garage-auth-modal-overlay.open #garage-auth-modal-wrap {
        transform: translateY(0); opacity: 1;
      }
      .gam-slider { display: none; }
      .gam-form-panel { padding: 32px 24px 48px; justify-content: flex-start; }
    }
  `;

  function buildHTML() {
    var slidesHTML = SLIDES.map(function (s) {
      return '<div class="gam-slide">' +
        '<img src="' + s.img + '" alt="' + s.alt + '" loading="lazy">' +
        '<div class="gam-overlay"></div>' +
        '<div class="gam-caption">' +
          '<span class="gam-caption-tag">' + s.tag + '</span>' +
          '<h3>' + s.title + '</h3>' +
          '<p>' + s.sub + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div id="garage-auth-modal-overlay">' +
      '<div id="garage-auth-modal-wrap">' +
        '<button id="garage-auth-modal-close" aria-label="סגור">' +
          '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>' +
        /* Form panel (RTL col-1 = RIGHT visually) */
        '<div class="gam-form-panel">' +
          '<div class="gam-logo">' +
            '<img src="https://garage.org.il/wp-content/uploads/2020/12/%D7%9C%D7%95%D7%92%D7%95-%D7%92%D7%A8%D7%90%D7%92-%D7%97%D7%93%D7%A9.png" alt="GARAGE" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="gam-tabs">' +
            '<button class="gam-tab active" id="gamTabLogin" onclick="GarageAuthModal.switchTab(\'login\')">כניסה</button>' +
            '<button class="gam-tab" id="gamTabRegister" onclick="GarageAuthModal.switchTab(\'register\')">הרשמה</button>' +
          '</div>' +
          /* Login */
          '<div class="gam-panel active" id="gamPanelLogin">' +
            '<div class="gam-msg" id="gamLoginMsg"></div>' +
            '<div class="gam-fields">' +
              '<div class="gam-field"><label for="gamLoginPhone">טלפון</label>' +
                '<input id="gamLoginPhone" type="tel" autocomplete="tel" placeholder="050-1234567"></div>' +
              '<div class="gam-field"><label for="gamLoginPw">סיסמה</label>' +
                '<div class="gam-field-pw">' +
                  '<input id="gamLoginPw" type="password" autocomplete="current-password" placeholder="••••••••">' +
                  '<button type="button" class="gam-pw-toggle" onclick="GarageAuthModal.togglePw(\'gamLoginPw\',this)" aria-label="הצג סיסמה">' +
                    '<i class="ph ph-eye" style="font-size:17px"></i>' +
                  '</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<button class="gam-submit" id="gamLoginBtn" onclick="GarageAuthModal.doLogin()">' +
              '<span class="gam-spinner" id="gamLoginSpinner"></span>' +
              '<span id="gamLoginBtnText">התחבר</span>' +
            '</button>' +
            '<p class="gam-switch">אין לך חשבון? <button onclick="GarageAuthModal.switchTab(\'register\')">הירשם בחינם</button></p>' +
          '</div>' +
          /* Register */
          '<div class="gam-panel" id="gamPanelRegister">' +
            '<div class="gam-msg" id="gamRegisterMsg"></div>' +
            '<div class="gam-fields">' +
              '<div class="gam-field"><label for="gamRegName">שם מלא</label>' +
                '<input id="gamRegName" type="text" autocomplete="name" placeholder="ישראל ישראלי"></div>' +
              '<div class="gam-field"><label for="gamRegPhone">טלפון</label>' +
                '<input id="gamRegPhone" type="tel" autocomplete="tel" placeholder="050-1234567"></div>' +
              '<div class="gam-field"><label for="gamRegEmail">אימייל <span class="gam-optional">(לא חובה)</span></label>' +
                '<input id="gamRegEmail" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
              '<div class="gam-field"><label for="gamRegPw">סיסמה</label>' +
                '<div class="gam-field-pw">' +
                  '<input id="gamRegPw" type="password" autocomplete="new-password" placeholder="לפחות 6 תווים">' +
                  '<button type="button" class="gam-pw-toggle" onclick="GarageAuthModal.togglePw(\'gamRegPw\',this)" aria-label="הצג סיסמה">' +
                    '<i class="ph ph-eye" style="font-size:17px"></i>' +
                  '</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<button class="gam-submit" id="gamRegBtn" onclick="GarageAuthModal.doRegister()">' +
              '<span class="gam-spinner" id="gamRegSpinner"></span>' +
              '<span id="gamRegBtnText">צור חשבון</span>' +
            '</button>' +
            '<p class="gam-switch">כבר יש לך חשבון? <button onclick="GarageAuthModal.switchTab(\'login\')">התחבר</button></p>' +
          '</div>' +
        '</div>' +
        /* Image panel (RTL col-2 = LEFT visually) */
        '<div class="gam-slider" id="gamSlider">' +
          '<div class="gam-track" id="gamTrack">' + slidesHTML + '</div>' +
          '<div class="gam-dots" id="gamDots"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var overlay, currentSlide = 0, sliderTimer = null;

  function inject() {
    if (document.getElementById('garage-auth-modal-overlay')) return;
    // CSS
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    // HTML
    var tmp = document.createElement('div');
    tmp.innerHTML = buildHTML();
    document.body.appendChild(tmp.firstChild);
    overlay = document.getElementById('garage-auth-modal-overlay');

    // Close handlers
    document.getElementById('garage-auth-modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        if (!overlay || !overlay.classList.contains('open')) return;
        var loginActive = document.getElementById('gamPanelLogin').classList.contains('active');
        if (loginActive) window.GarageAuthModal.doLogin();
        else window.GarageAuthModal.doRegister();
      }
    });
    initSlider();
  }

  function initSlider() {
    var track = document.getElementById('gamTrack');
    var dotsEl = document.getElementById('gamDots');
    if (!track) return;
    SLIDES.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'gam-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'שקופית ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(d);
    });
    function goTo(n) {
      currentSlide = (n + SLIDES.length) % SLIDES.length;
      track.style.transform = 'translateX(' + (currentSlide * 100) + '%)';
      dotsEl.querySelectorAll('.gam-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }
    var sliderEl = document.getElementById('gamSlider');
    sliderEl.addEventListener('mouseenter', function () { clearInterval(sliderTimer); });
    sliderEl.addEventListener('mouseleave', function () {
      sliderTimer = setInterval(function () { goTo(currentSlide + 1); }, 4500);
    });
    sliderTimer = setInterval(function () { goTo(currentSlide + 1); }, 4500);
  }

  function open(tab) {
    inject();
    overlay = document.getElementById('garage-auth-modal-overlay');
    window.GarageAuthModal.switchTab(tab || 'login');
    clearMsgs();
    requestAnimationFrame(function () {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function clearMsgs() {
    ['gamLoginMsg', 'gamRegisterMsg'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.textContent = ''; }
    });
  }

  function showMsg(id, text, type) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'gam-msg ' + type;
    el.style.display = 'block';
  }

  function setLoading(btnId, spinnerId, textId, loading, label) {
    var btn = document.getElementById(btnId);
    var sp = document.getElementById(spinnerId);
    var tx = document.getElementById(textId);
    if (btn) btn.disabled = loading;
    if (sp) sp.style.display = loading ? 'block' : 'none';
    if (tx) tx.textContent = label;
  }

  window.GarageAuthModal = {
    open: open,
    close: close,

    switchTab: function (tab) {
      document.getElementById('gamPanelLogin').classList.toggle('active', tab === 'login');
      document.getElementById('gamPanelRegister').classList.toggle('active', tab === 'register');
      document.getElementById('gamTabLogin').classList.toggle('active', tab === 'login');
      document.getElementById('gamTabRegister').classList.toggle('active', tab === 'register');
      clearMsgs();
    },

    togglePw: function (inputId, btn) {
      var inp = document.getElementById(inputId);
      var icon = btn.querySelector('i');
      if (!inp) return;
      if (inp.type === 'password') {
        inp.type = 'text'; icon.className = 'ph ph-eye-slash';
      } else {
        inp.type = 'password'; icon.className = 'ph ph-eye';
      }
    },

    doLogin: async function () {
      clearMsgs();
      var phone = (document.getElementById('gamLoginPhone').value || '').trim();
      var password = document.getElementById('gamLoginPw').value;
      if (!phone || !password) { showMsg('gamLoginMsg', 'נא למלא טלפון וסיסמה', 'error'); return; }
      setLoading('gamLoginBtn', 'gamLoginSpinner', 'gamLoginBtnText', true, 'מתחבר...');
      try {
        var res = await GarageAuth.apiFetch('/api/storefront/auth/login', {
          method: 'POST', body: JSON.stringify({ phone: phone, password: password })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'שגיאה בהתחברות');
        GarageAuth.setToken(data.token);
        GarageAuth.setCustomer(data.customer);
        showMsg('gamLoginMsg', 'התחברת בהצלחה!', 'success');
        setTimeout(function () {
          close();
          if (typeof GarageAuth.renderNavSlot === 'function') GarageAuth.renderNavSlot();
        }, 700);
      } catch (err) {
        showMsg('gamLoginMsg', err.message, 'error');
        setLoading('gamLoginBtn', 'gamLoginSpinner', 'gamLoginBtnText', false, 'התחבר');
      }
    },

    doRegister: async function () {
      clearMsgs();
      var name = (document.getElementById('gamRegName').value || '').trim();
      var phone = (document.getElementById('gamRegPhone').value || '').trim();
      var email = (document.getElementById('gamRegEmail').value || '').trim();
      var password = document.getElementById('gamRegPw').value;
      if (!name || !phone || !password) { showMsg('gamRegisterMsg', 'נא למלא שם, טלפון וסיסמה', 'error'); return; }
      if (password.length < 6) { showMsg('gamRegisterMsg', 'הסיסמה חייבת להכיל לפחות 6 תווים', 'error'); return; }
      setLoading('gamRegBtn', 'gamRegSpinner', 'gamRegBtnText', true, 'יוצר חשבון...');
      try {
        var body = { name: name, phone: phone, password: password };
        if (email) body.email = email;
        var res = await GarageAuth.apiFetch('/api/storefront/auth/signup', {
          method: 'POST', body: JSON.stringify(body)
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'שגיאה בהרשמה');
        GarageAuth.setToken(data.token);
        GarageAuth.setCustomer(data.customer);
        showMsg('gamRegisterMsg', 'ברוך הבא!', 'success');
        setTimeout(function () {
          close();
          if (typeof GarageAuth.renderNavSlot === 'function') GarageAuth.renderNavSlot();
        }, 700);
      } catch (err) {
        showMsg('gamRegisterMsg', err.message, 'error');
        setLoading('gamRegBtn', 'gamRegSpinner', 'gamRegBtnText', false, 'צור חשבון');
      }
    }
  };

})();
