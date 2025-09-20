// theme.js — manage light/dark theme across pages
(function(){
  const KEY = 'guitar_tools_theme';
  const root = document.documentElement;

  function setDataTheme(mode) {
    if (mode === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  function applyMode(mode) {
    // mode: 'system' | 'light' | 'dark'
    if (mode === 'system') {
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDataTheme(prefers ? 'dark' : 'light');
    } else {
      setDataTheme(mode === 'dark' ? 'dark' : 'light');
    }
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    // sync selects
    const sel = document.getElementById('themeSelect');
    if (sel) sel.value = mode;
  }

  function getSaved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('themeSelect');
    const seg = document.querySelectorAll('.theme-seg .seg-btn');
    let saved = getSaved();
    if (!saved) saved = 'system';

    // add a smooth transition class to body for one-shot transitions
    document.documentElement.classList.add('theme-init');
    setTimeout(() => document.documentElement.classList.remove('theme-init'), 300);

    applyMode(saved);

    // helper to set UI state
    function setSegState(mode) {
      seg.forEach(btn => {
        const m = btn.getAttribute('data-mode');
        const pressed = (m === mode);
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        btn.classList.toggle('active', pressed);
      });
      if (sel) sel.value = mode;
    }

    setSegState(saved);

    seg.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        applyMode(mode);
        setSegState(mode);
      });
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); btn.click(); }
      });
    });

    // respond to system changes when mode === 'system'
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e) => {
        const cur = getSaved() || 'system';
        if (cur === 'system') {
          applyMode('system');
          setSegState('system');
        }
      });
    } catch (e) { /* ignore */ }
  });

  window.setTheme = applyMode;
})();
