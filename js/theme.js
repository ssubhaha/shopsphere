/* ============================================================
   ShopSphere — theme.js
   Dark / Light mode manager
   ============================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'shopsphere-theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  let current = localStorage.getItem(STORAGE_KEY)
    || (window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK);

  function apply(theme) {
    current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    _updateIcons();
  }

  function toggle() {
    apply(current === DARK ? LIGHT : DARK);
  }

  function _updateIcons() {
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.textContent = current === DARK ? '☀️' : '🌙';
      el.setAttribute('aria-label', current === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function init() {
    apply(current);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, get current() { return current; } };
})();