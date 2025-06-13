// Cookie Consent Widget (multilingual + light/dark)
// Usage: <script src="cookie-consent.js"></script> before </body>
(function () {
  const storageKey = 'cookieConsent';
  const translations = {
    ru: {
      message: 'Мы используем файлы cookie, чтобы улучшить работу сайта. Согласны?',
      accept: 'Принять',
      decline: 'Отклонить'
    },
    en: {
      message: 'We use cookies to improve your experience. Do you agree?',
      accept: 'Accept',
      decline: 'Decline'
    },
    de: {
      message: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Sind Sie einverstanden?',
      accept: 'Akzeptieren',
      decline: 'Ablehnen'
    }
  };

  // Inject CSS only once
  function injectStyles() {
    if (document.getElementById('cookie-consent-style')) return; // already injected

    const css = `:root { --cc-bg:#f9fafb; --cc-text:#111; --cc-accept-bg:#4caf50; --cc-decline-bg:#f44336; }
html.dark { --cc-bg:#222; --cc-text:#fff; }
#cookie-consent{position:fixed;inset-block-end:0;inset-inline:0;background:var(--cc-bg);color:var(--cc-text);padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 -2px 12px rgba(0,0,0,.35);font-family:system-ui,sans-serif;gap:1rem;border-radius:1rem 1rem 0 0;z-index:1000;transition:transform .3s ease-in-out;}
#cookie-consent.hidden{display:none;}
#cookie-consent .buttons{display:flex;flex-shrink:0;gap:0.5rem;}
#cookie-consent button{padding:0.5rem 1rem;border:none;border-radius:0.5rem;cursor:pointer;font-size:1rem;transition:opacity .2s ease-in-out;}
#cookie-accept{background:var(--cc-accept-bg);color:#fff;}
#cookie-decline{background:var(--cc-decline-bg);color:#fff;}
#cookie-consent button:hover{opacity:.9;}
@media(max-width:600px){#cookie-consent{flex-direction:column;text-align:center;}#cookie-consent .buttons{justify-content:center;}}`;

    const style = document.createElement('style');
    style.id = 'cookie-consent-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function detectLang() {
    const attrLang = document.documentElement.lang?.slice(0, 2);
    const navLang = navigator.language?.slice(0, 2);
    return translations[attrLang] ? attrLang : translations[navLang] ? navLang : 'en';
  }

  function setConsent(value) {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${storageKey}=${value}; path=/; max-age=${maxAge}`;
    try { localStorage.setItem(storageKey, value); } catch (e) { }
  }

  function getConsent() {
    const match = document.cookie.match(new RegExp(`(?:^|; )${storageKey}=([^;]*)`));
    if (match) return match[1];
    try { return localStorage.getItem(storageKey); } catch (e) { return null; }
  }

  function buildBanner(lang) {
    if (document.getElementById('cookie-consent')) return; // already exists

    const t = translations[lang] || translations.en;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.className = 'cookie-consent hidden';

    const message = document.createElement('p');
    message.textContent = t.message;
    banner.appendChild(message);

    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'buttons';

    const acceptBtn = document.createElement('button');
    acceptBtn.id = 'cookie-accept';
    acceptBtn.textContent = t.accept;

    const declineBtn = document.createElement('button');
    declineBtn.id = 'cookie-decline';
    declineBtn.textContent = t.decline;

    btnWrapper.appendChild(acceptBtn);
    btnWrapper.appendChild(declineBtn);
    banner.appendChild(btnWrapper);

    document.body.appendChild(banner);

    acceptBtn.addEventListener('click', () => {
      setConsent('accepted');
      banner.classList.add('hidden');
    });

    declineBtn.addEventListener('click', () => {
      setConsent('declined');
      banner.classList.add('hidden');
    });

    return banner;
  }

  function init() {
    injectStyles();

    // If already answered, do nothing
    if (getConsent()) return;

    const lang = detectLang();
    const banner = buildBanner(lang);
    if (banner) banner.classList.remove('hidden');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
