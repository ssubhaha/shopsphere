/* ============================================================
   ShopSphere — cart.js
   Cart state, drawer, persistence, quantity controls
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'shopsphere-cart';
  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  /* ── Persistence ── */
  function _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    _render();
    _updateCount();
  }

  /* ── State helpers ── */
  function _find(id) { return items.find(i => i.id === id); }

  function add(product) {
    const existing = _find(product.id);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ ...product, qty: 1 });
    }
    _save();
    Toast.show(`${product.name} added to cart`, 'success', '🛒');
    _animateCount();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    _save();
  }

  function updateQty(id, delta) {
    const item = _find(id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    _save();
  }

  function clear() {
    items = [];
    _save();
  }

  function total() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  /* ── UI updates ── */
  function _updateCount() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count();
    });
  }

  function _animateCount() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    });
  }

  /* ── Drawer rendering ── */
  function _render() {
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (items.length === 0) {
      itemsEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'flex';

    itemsEl.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img
          class="cart-item__img"
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
        />
        <div class="cart-item__info">
          <p class="cart-item__cat">${item.category}</p>
          <p class="cart-item__name">${item.name}</p>
          <div class="cart-item__controls">
            <div class="cart-item__qty">
              <button aria-label="Decrease quantity" onclick="Cart.updateQty(${item.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button aria-label="Increase quantity" onclick="Cart.updateQty(${item.id}, 1)">+</button>
            </div>
            <span class="cart-item__price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            <button class="cart-item__remove" onclick="Cart.remove(${item.id})" aria-label="Remove item">✕ Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotal = total();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;   // GST 18%
    const grand = subtotal + shipping + tax;

    const q = id => document.getElementById(id);
    if (q('summarySubtotal'))  q('summarySubtotal').textContent  = `₹${subtotal.toLocaleString('en-IN')}`;
    if (q('summaryShipping'))  q('summaryShipping').textContent  = shipping === 0 ? 'Free' : `₹${shipping.toFixed(0)}`;
    if (q('summaryTax'))       q('summaryTax').textContent       = `₹${Math.round(tax).toLocaleString('en-IN')} (GST)`;
    if (q('summaryTotal'))     q('summaryTotal').textContent     = `₹${Math.round(grand).toLocaleString('en-IN')}`;
  }

  /* ── Drawer open / close ── */
  function openDrawer() {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartDrawer')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    _render();
  }

  function closeDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ── */
  function init() {
    _updateCount();
    _render();

    // Drawer triggers
    document.querySelectorAll('[data-open-cart]').forEach(el =>
      el.addEventListener('click', openDrawer));

    document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);
    document.getElementById('cartCloseBtn')?.addEventListener('click', closeDrawer);

    // Checkout stub
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      if (items.length === 0) return;
      Toast.show('Redirecting to checkout…', 'success', '🔒');
      setTimeout(() => {
        clear();
        closeDrawer();
        Toast.show('Order placed! Thank you 🎉', 'success', '✅');
      }, 1500);
    });
  }

  return { init, add, remove, updateQty, clear, total, count, openDrawer, closeDrawer };
})();