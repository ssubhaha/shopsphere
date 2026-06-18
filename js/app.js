/* ============================================================
   ShopSphere — app.js
   Main entry: Toast system, page renderers, router wiring
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   TOAST SYSTEM  (global, used everywhere)
══════════════════════════════════════════════════════════ */
const Toast = (() => {
  function show(message, type = '', icon = 'ℹ️', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__msg">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  }

  return { show };
})();


/* ══════════════════════════════════════════════════════════
   SHARED LAYOUT BUILDERS
══════════════════════════════════════════════════════════ */
function buildNavbar() {
  return `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="container navbar__inner">

        <a href="#/" class="navbar__brand" aria-label="ShopSphere home">
          <div class="navbar__brand-icon" aria-hidden="true">✦</div>
          <span class="navbar__brand-text">ShopSphere</span>
        </a>

        <ul class="navbar__links" role="list">
          <li><a href="#/"         class="navbar__link" data-nav-link>Home</a></li>
          <li><a href="#/products" class="navbar__link" data-nav-link>Products</a></li>
          <li><a href="#/cart"     class="navbar__link" data-nav-link>Cart</a></li>
          <li><a href="#/about"    class="navbar__link" data-nav-link>About</a></li>
        </ul>

        <div class="navbar__actions">
          <button class="navbar__theme-btn"
                  data-theme-toggle
                  data-theme-icon
                  aria-label="Toggle theme">🌙</button>

          <button class="navbar__cart-btn" data-open-cart aria-label="Open cart">
            🛒 <span class="cart-label">Cart</span>
            <span class="navbar__cart-count" data-cart-count>0</span>
          </button>

          <button class="navbar__hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="navbar__mobile-menu" id="mobileMenu" role="menu">
        <a href="#/"         class="navbar__link" data-nav-link role="menuitem">Home</a>
        <a href="#/products" class="navbar__link" data-nav-link role="menuitem">Products</a>
        <a href="#/cart"     class="navbar__link" data-nav-link role="menuitem">Cart</a>
        <a href="#/about"    class="navbar__link" data-nav-link role="menuitem">About</a>
      </div>
    </nav>`;
}

function buildCartDrawer() {
  return `
    <div class="cart-overlay" id="cartOverlay" role="presentation"></div>

    <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Your Cart</h2>
        <button class="cart-drawer__close" id="cartCloseBtn" aria-label="Close cart">✕</button>
      </div>

      <div class="cart-drawer__items" id="cartItems" aria-live="polite"></div>

      <div class="cart-empty" id="cartEmpty" style="display:flex">
        <div class="cart-empty__icon">🛒</div>
        <p>Your cart is empty.<br>Start shopping to add items.</p>
        <button class="btn btn--primary" onclick="Cart.closeDrawer();Router.navigate('/products')">
          Browse Products
        </button>
      </div>

      <div class="cart-drawer__footer" id="cartFooter" style="display:none">
        <div class="cart-summary">
          <div class="cart-summary__row">
            <span>Subtotal</span>
            <span id="summarySubtotal">₹0</span>
          </div>
          <div class="cart-summary__row">
            <span>Shipping</span>
            <span id="summaryShipping">—</span>
          </div>
          <div class="cart-summary__row">
            <span>Tax (GST 18%)</span>
            <span id="summaryTax">₹0</span>
          </div>
          <div class="cart-summary__row total">
            <span>Total</span>
            <span class="val" id="summaryTotal">₹0</span>
          </div>
        </div>
        <button class="btn btn--primary btn--full" id="checkoutBtn">
          🔒 Secure Checkout
        </button>
        <button class="btn btn--ghost btn--full" onclick="Cart.closeDrawer()">
          Continue Shopping
        </button>
      </div>
    </aside>`;
}

function buildFooter() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <p class="footer__brand-name">ShopSphere</p>
            <p class="footer__tagline">Premium products, curated for the discerning shopper. Quality that speaks for itself — delivered to your door.</p>
          </div>

          <div>
            <p class="footer__col-title">Shop</p>
            <ul class="footer__links">
              <li><a href="#/products" class="footer__link">All Products</a></li>
              <li><a href="#/products?cat=electronics" class="footer__link">Electronics</a></li>
              <li><a href="#/products?cat=fashion" class="footer__link">Fashion</a></li>
              <li><a href="#/products?cat=home" class="footer__link">Home & Living</a></li>
            </ul>
          </div>

          <div>
            <p class="footer__col-title">Company</p>
            <ul class="footer__links">
              <li><a href="#/about"  class="footer__link">About Us</a></li>
              <li><a href="#/about"  class="footer__link">Careers</a></li>
              <li><a href="#/about"  class="footer__link">Press</a></li>
              <li><a href="#/about"  class="footer__link">Blog</a></li>
            </ul>
          </div>

          <div>
            <p class="footer__col-title">Support</p>
            <ul class="footer__links">
              <li><a href="#/about" class="footer__link">Help Centre</a></li>
              <li><a href="#/about" class="footer__link">Returns</a></li>
              <li><a href="#/about" class="footer__link">Track Order</a></li>
              <li><a href="#/about" class="footer__link">Contact</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <p>© 2026 ShopSphere. All Rights Reserved.</p>
        </div>
      </div>
    </footer>`;
}

function buildModal() {
  return `<div class="modal-overlay" id="productModal" role="presentation"></div>`;
}

/* ── Inject persistent chrome ── */
function mountChrome() {
  const navWrap = document.getElementById('navWrap');
  const footerWrap = document.getElementById('footerWrap');
  const cartWrap = document.getElementById('cartWrap');
  const modalWrap = document.getElementById('modalWrap');

  if (navWrap && !navWrap.dataset.mounted) {
    navWrap.innerHTML = buildNavbar();
    navWrap.dataset.mounted = '1';
  }
  if (footerWrap && !footerWrap.dataset.mounted) {
    footerWrap.innerHTML = buildFooter();
    footerWrap.dataset.mounted = '1';
  }
  if (cartWrap && !cartWrap.dataset.mounted) {
    cartWrap.innerHTML = buildCartDrawer();
    cartWrap.dataset.mounted = '1';
    Cart.init();
  }
  if (modalWrap && !modalWrap.dataset.mounted) {
    modalWrap.innerHTML = buildModal();
    modalWrap.dataset.mounted = '1';
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    // close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      })
    );
  }

  ThemeManager.init();
}


/* ══════════════════════════════════════════════════════════
   PAGE: HOME
══════════════════════════════════════════════════════════ */
function renderHomePage() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <!-- HERO -->
    <section class="hero" style="
      padding: 140px 0 100px;
      background: radial-gradient(ellipse 80% 60% at 60% 40%,
        rgba(99,102,241,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%,
        rgba(217,70,239,0.1) 0%, transparent 60%);
    ">
      <div class="container" style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center">
        <div>
          <div class="hero__badge" style="display:flex;align-items:center;gap:.5rem;margin-bottom:1.5rem">
            <span class="badge badge--new">✦ New Arrivals 2026</span>
          </div>
          <h1 class="hero__title section-heading__title" style="margin-bottom:1.25rem">
            Shop the <span class="gradient-text">Future</span><br>of Premium Retail
          </h1>
          <p class="hero__sub" style="font-size:1.05rem;color:var(--clr-text-2);max-width:420px;margin-bottom:2rem;line-height:1.7">
            Handpicked electronics, fashion, home essentials and beauty — all in one curated destination built for those who refuse to settle.
          </p>
          <div class="hero__ctas" style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3rem">
            <a href="#/products" class="btn btn--primary btn--lg">
              Explore Products →
            </a>
            <a href="#/about" class="btn btn--ghost btn--lg">
              Our Story
            </a>
          </div>
          <div class="hero__stats" style="display:flex;gap:3rem">
            ${[['12K+','Products'],['98%','Satisfaction'],['50+','Brands'],['Free','Shipping ₹999+']].map(([val,lbl]) => `
              <div>
                <p style="font-size:1.4rem;font-weight:800;background:var(--grad-text);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${val}</p>
                <p style="font-size:0.75rem;color:var(--clr-text-3);font-weight:500;letter-spacing:.05em;text-transform:uppercase">${lbl}</p>
              </div>`).join('')}
          </div>
        </div>

        <!-- floating product cards visual -->
        <div class="hero__visual" style="position:relative;height:480px" aria-hidden="true">
          ${_heroVisualCards()}
        </div>
      </div>
    </section>

    <!-- MARQUEE TRUST BAR -->
    <div style="
      border-top:1px solid var(--clr-border);
      border-bottom:1px solid var(--clr-border);
      overflow:hidden;
      padding:14px 0;
      background:var(--clr-surface);
    ">
      <div style="display:flex;gap:3rem;white-space:nowrap;animation:marquee 20s linear infinite;width:max-content">
        ${Array(3).fill(['🚚 Free shipping over ₹8,300','🔒 Secure payments','↩️ 30-day returns','⭐ 4.9 avg rating','🌍 Ships worldwide','💬 24/7 support']).flat()
          .map(t=>`<span style="font-size:.82rem;font-weight:600;color:var(--clr-text-2);letter-spacing:.03em">${t}</span>`).join('')}
      </div>
    </div>
    <style>
      @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
    </style>

    <!-- FEATURED CATEGORIES -->
    <section style="padding:5rem 0">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__eyebrow">Browse by Category</p>
          <h2 class="section-heading__title">Everything You Need</h2>
          <p class="section-heading__sub">From cutting-edge tech to timeless fashion — explore our curated collections.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem">
          ${_categoryCards()}
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section style="padding:0 0 5rem">
      <div class="container">
        <div class="section-heading" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:1rem">
          <div>
            <p class="section-heading__eyebrow">Hand-Picked For You</p>
            <h2 class="section-heading__title">Featured Products</h2>
          </div>
          <a href="#/products" class="btn btn--ghost">View all →</a>
        </div>
        <div class="product-grid" id="featuredGrid"></div>
      </div>
    </section>

    <!-- PROMO BANNER -->
    <section style="padding:0 0 5rem">
      <div class="container">
        <div style="
          border-radius:var(--radius-xl);
          background: var(--grad-primary);
          padding:3.5rem;
          display:flex;align-items:center;justify-content:space-between;
          gap:2rem;flex-wrap:wrap;
          position:relative;overflow:hidden;
        ">
          <div style="position:absolute;right:-40px;top:-40px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,.07)"></div>
          <div style="position:absolute;right:60px;bottom:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.05)"></div>
          <div style="position:relative;z-index:1">
            <p style="font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:.5rem">Limited Time</p>
            <h2 style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:#fff;margin-bottom:.75rem">Get 20% Off Your<br>First Order</h2>
            <p style="color:rgba(255,255,255,.8);font-size:.95rem">Use code <strong>SPHERE20</strong> at checkout. New customers only.</p>
          </div>
          <a href="#/products" class="btn btn--lg" style="background:#fff;color:#6366f1;font-weight:700;position:relative;z-index:1;flex-shrink:0">
            Shop Now →
          </a>
        </div>
      </div>
    </section>
  `;

  // Render skeletons then products
  ProductManager.renderSkeletons('featuredGrid', 4);
  setTimeout(() => {
    ProductManager.renderGrid('featuredGrid', PRODUCTS.filter(p => p.badge).slice(0, 4));
  }, 400);
}

function _heroVisualCards() {
  const featured = PRODUCTS.slice(0, 3);
  const positions = [
    'top:0;left:0;width:200px;transform:rotate(-3deg)',
    'top:80px;right:0;width:200px;transform:rotate(2deg)',
    'bottom:0;left:60px;width:200px;transform:rotate(-1deg)',
  ];
  return featured.map((p, i) => `
    <div style="
      position:absolute;${positions[i]};
      background:var(--clr-surface-2);
      border:1px solid var(--clr-border);
      border-radius:var(--radius-lg);
      overflow:hidden;
      box-shadow:var(--shadow-lg);
      transition:transform .3s;
      animation: float${i} ${3 + i}s ease-in-out infinite alternate;
    ">
      <img src="${p.image}" alt="${p.name}" style="width:100%;height:130px;object-fit:cover"/>
      <div style="padding:.75rem">
        <p style="font-size:.7rem;color:var(--clr-text-3);text-transform:uppercase;letter-spacing:.06em">${p.category}</p>
        <p style="font-size:.8rem;font-weight:600;margin:.2rem 0">${p.name}</p>
        <p style="font-size:.85rem;font-weight:700;background:var(--grad-text);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">₹${p.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
    <style>
      @keyframes float${i}{from{transform:rotate(${[-3,2,-1][i]}deg) translateY(0)}to{transform:rotate(${[-3,2,-1][i]}deg) translateY(-10px)}}
    </style>
  `).join('');
}

function _categoryCards() {
  const cats = [
    { id: 'electronics', label: 'Electronics', icon: '💻', color: '#6366f1' },
    { id: 'fashion',     label: 'Fashion',     icon: '👔', color: '#d946ef' },
    { id: 'home',        label: 'Home',         icon: '🏡', color: '#0ea5e9' },
    { id: 'sports',      label: 'Sports',       icon: '🏃', color: '#10b981' },
    { id: 'beauty',      label: 'Beauty',       icon: '✨', color: '#f59e0b' },
  ];
  return cats.map(c => `
    <a href="#/products" onclick="setTimeout(()=>App.setCategory('${c.id}'),50)"
       style="
         display:flex;flex-direction:column;align-items:center;gap:.75rem;
         padding:1.5rem 1rem;
         background:var(--clr-surface-2);
         border:1px solid var(--clr-border);
         border-radius:var(--radius-lg);
         text-align:center;
         transition:all .2s;
         cursor:pointer;
         text-decoration:none;
       "
       onmouseover="this.style.borderColor='${c.color}40';this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px ${c.color}20'"
       onmouseout="this.style.borderColor='';this.style.transform='';this.style.boxShadow=''">
      <div style="
        width:52px;height:52px;border-radius:var(--radius-md);
        background:${c.color}20;
        display:flex;align-items:center;justify-content:center;
        font-size:1.4rem;
      ">${c.icon}</div>
      <p style="font-size:.85rem;font-weight:600;color:var(--clr-text-1)">${c.label}</p>
    </a>`).join('');
}


/* ══════════════════════════════════════════════════════════
   PAGE: PRODUCTS
══════════════════════════════════════════════════════════ */
let _activeCategory = 'all';
let _searchQuery    = '';
let _sortMode       = 'default';

function App_setCategory(cat) { _activeCategory = cat; renderProductsPage(); }

function renderProductsPage() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div style="padding-top:calc(var(--nav-h) + 2.5rem);padding-bottom:5rem" class="page-fade">
      <div class="container">
        <!-- Header -->
        <div class="section-heading" style="margin-bottom:2rem">
          <p class="section-heading__eyebrow">Our Catalogue</p>
          <h1 class="section-heading__title">All Products</h1>
          <p class="section-heading__sub">Discover our full range of premium products.</p>
        </div>

        <!-- Search -->
        <div class="search-wrap" id="searchWrap">
          <span class="search-wrap__icon" aria-hidden="true">🔍</span>
          <input
            id="searchInput"
            type="search"
            class="search-input"
            placeholder="Search products…"
            aria-label="Search products"
            value="${_searchQuery}"
          />
          <button class="search-clear" id="searchClear" aria-label="Clear search">✕</button>
        </div>

        <!-- Filters -->
        <div class="filters" role="group" aria-label="Filter by category">
          ${CATEGORIES.map(c => `
            <button class="filter-pill ${_activeCategory === c.id ? 'active' : ''}"
                    data-cat="${c.id}"
                    aria-pressed="${_activeCategory === c.id}">
              ${c.label}
            </button>`).join('')}

          <select class="sort-select" id="sortSelect" aria-label="Sort products">
            <option value="default"    ${_sortMode==='default'    ?'selected':''}>Sort: Default</option>
            <option value="price-asc"  ${_sortMode==='price-asc'  ?'selected':''}>Price: Low → High</option>
            <option value="price-desc" ${_sortMode==='price-desc' ?'selected':''}>Price: High → Low</option>
            <option value="rating"     ${_sortMode==='rating'     ?'selected':''}>Top Rated</option>
            <option value="name"       ${_sortMode==='name'       ?'selected':''}>Name A–Z</option>
          </select>
        </div>

        <!-- Results count -->
        <p id="resultsCount" style="font-size:.85rem;color:var(--clr-text-3);margin-bottom:1.5rem"></p>

        <!-- Grid -->
        <div class="product-grid" id="productsGrid"></div>
      </div>
    </div>`;

  _applyFilters();
  _bindProductPageEvents();
}

function _applyFilters() {
  let results = [...PRODUCTS];

  // category
  if (_activeCategory !== 'all') {
    results = results.filter(p => p.category === _activeCategory);
  }

  // search
  if (_searchQuery.trim()) {
    const q = _searchQuery.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // sort
  switch (_sortMode) {
    case 'price-asc':  results.sort((a,b) => a.price - b.price); break;
    case 'price-desc': results.sort((a,b) => b.price - a.price); break;
    case 'rating':     results.sort((a,b) => b.rating - a.rating); break;
    case 'name':       results.sort((a,b) => a.name.localeCompare(b.name)); break;
  }

  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = `${results.length} product${results.length !== 1 ? 's' : ''} found`;

  ProductManager.renderGrid('productsGrid', results);
}

function _bindProductPageEvents() {
  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeCategory = btn.dataset.cat;
      document.querySelectorAll('.filter-pill').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn);
      });
      _applyFilters();
    });
  });

  // Sort
  const sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.addEventListener('change', e => { _sortMode = e.target.value; _applyFilters(); });

  // Search
  const searchEl = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  const wrapEl   = document.getElementById('searchWrap');

  if (searchEl) {
    let debounce;
    searchEl.addEventListener('input', e => {
      _searchQuery = e.target.value;
      wrapEl?.classList.toggle('has-value', !!_searchQuery);
      clearTimeout(debounce);
      debounce = setTimeout(_applyFilters, 280);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      _searchQuery = '';
      if (searchEl) searchEl.value = '';
      wrapEl?.classList.remove('has-value');
      _applyFilters();
    });
  }
}


/* ══════════════════════════════════════════════════════════
   PAGE: CART (opens cart drawer over home page)
══════════════════════════════════════════════════════════ */
function renderCartPage() {
  // Render home as backdrop then open the drawer
  renderHomePage();
  setTimeout(() => Cart.openDrawer(), 50);
}


/* ══════════════════════════════════════════════════════════
   PAGE: ABOUT
══════════════════════════════════════════════════════════ */
function renderAboutPage() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div style="padding-top:calc(var(--nav-h) + 2.5rem);padding-bottom:5rem" class="page-fade">

      <!-- Hero -->
      <section style="
        text-align:center;
        padding:3rem 0 5rem;
        background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(99,102,241,.12),transparent 70%);
      ">
        <div class="container">
          <span class="badge badge--new" style="margin-bottom:1.5rem;display:inline-flex">✦ Our Story</span>
          <h1 class="section-heading__title" style="margin-bottom:1.25rem">
            Built for People Who<br><span class="gradient-text">Demand the Best</span>
          </h1>
          <p style="font-size:1.05rem;color:var(--clr-text-2);max-width:540px;margin:0 auto;line-height:1.8">
            ShopSphere was founded on a single belief: premium products shouldn't require compromise. We curate, test, and stand behind everything we sell.
          </p>
        </div>
      </section>

      <!-- Values -->
      <section style="padding:0 0 5rem">
        <div class="container">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem">
            ${[
              ['🎯','Curation Over Volume','Every product earns its place. We\'d rather offer 12 great options than 1200 mediocre ones.'],
              ['🔬','Quality Verified','Our team stress-tests, review-mines, and fact-checks before anything reaches the store.'],
              ['♻️','Sustainably Sourced','We prioritise brands with ethical supply chains and environmental commitments.'],
              ['💬','Radical Transparency','Real specs, real reviews, honest pricing — no dark patterns, ever.'],
            ].map(([icon, title, text]) => `
              <div style="
                padding:2rem;
                background:var(--clr-surface-2);
                border:1px solid var(--clr-border);
                border-radius:var(--radius-lg);
                transition:all .2s;
              "
              onmouseover="this.style.borderColor='var(--clr-border-glow)';this.style.transform='translateY(-4px)'"
              onmouseout="this.style.borderColor='var(--clr-border)';this.style.transform=''">
                <div style="font-size:2rem;margin-bottom:1rem">${icon}</div>
                <h3 style="font-size:1rem;font-weight:700;margin-bottom:.5rem">${title}</h3>
                <p style="font-size:.875rem;color:var(--clr-text-2);line-height:1.7">${text}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section style="padding:3rem 0 5rem;background:var(--clr-surface);border-top:1px solid var(--clr-border);border-bottom:1px solid var(--clr-border)">
        <div class="container">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center">
            ${[['2021','Founded'],['12K+','Products'],['180+','Countries'],['4.9★','Avg Rating']].map(([v,l]) => `
              <div>
                <p style="font-size:2.5rem;font-weight:800;background:var(--grad-text);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1">${v}</p>
                <p style="font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--clr-text-3);margin-top:.5rem">${l}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section style="padding:0 0 5rem">
        <div class="container" style="text-align:center">
          <div style="
            background:var(--grad-primary);
            border-radius:var(--radius-xl);
            padding:4rem 2rem;
          ">
            <h2 style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:#fff;margin-bottom:1rem">Ready to Shop Smarter?</h2>
            <p style="color:rgba(255,255,255,.8);margin-bottom:2rem">Join thousands of satisfied customers who trust ShopSphere.</p>
            <a href="#/products" class="btn btn--lg" style="background:#fff;color:#6366f1;font-weight:700">
              Start Shopping →
            </a>
          </div>
        </div>
      </section>
    </div>`;
}


/* ══════════════════════════════════════════════════════════
   APP BOOTSTRAP
══════════════════════════════════════════════════════════ */
const App = {
  setCategory(cat) {
    _activeCategory = cat;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  mountChrome();

  Router.register('/', renderHomePage);
  Router.register('/products', renderProductsPage);
  Router.register('/cart', renderCartPage);
  Router.register('/about', renderAboutPage);
  Router.notFound(() => {
    Router.navigate('/');
  });

  // If no hash set, default to home so router always resolves
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  }

  Router.init();
});