/* ============================================================
   ShopSphere — router.js
   Lightweight client-side router for seamless navigation
   ============================================================ */

const Router = (() => {
  const routes = {};
  let _notFound = null;

  function register(path, handler) {
    routes[path] = handler;
  }

  function notFound(handler) {
    _notFound = handler;
  }

  function _getHash() {
    return window.location.hash.slice(1) || '/';
  }

  function navigate(path) {
    window.location.hash = path;
  }

  function _resolve() {
    const path = _getHash();
    // exact match first
    if (routes[path]) {
      _run(routes[path], path);
      return;
    }
    // prefix match for dynamic segments  e.g.  /product/3
    for (const pattern in routes) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = path.match(regex);
      if (match) {
        const paramNames = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
        const params = {};
        paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        _run(routes[pattern], path, params);
        return;
      }
    }
    if (_notFound) _notFound(path);
  }

  function _run(handler, path, params = {}) {
    // update active nav links
    document.querySelectorAll('[data-nav-link]').forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === path || (path.startsWith(href) && href !== '/'));
    });
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // call page handler
    handler(params);
  }

  function init() {
    window.addEventListener('hashchange', _resolve);
    // Defer one tick so mountChrome() DOM injection settles
    setTimeout(_resolve, 0);
  }

  return { register, notFound, navigate, init };
})();