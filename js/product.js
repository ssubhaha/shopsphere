/* ============================================================
   ShopSphere — product.js
   Product card builder, quick-view modal, wishlist, filtering
   ============================================================ */

const ProductManager = (() => {
  let wishlist = JSON.parse(localStorage.getItem('shopsphere-wishlist') || '[]');

  /* ── Stars helper ── */
  function _stars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  /* ── Badge markup ── */
  function _badge(type) {
    if (!type) return '';
    const labels = { new: '✦ New', sale: '% Sale', bestseller: '🏆 Best Seller' };
    return `<span class="badge badge--${type}">${labels[type]}</span>`;
  }

  /* ── Single card HTML ── */
  function renderCard(product) {
    const wished = wishlist.includes(product.id);
    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const outOfStock = !product.inStock;

    return `
      <article class="product-card ${outOfStock ? 'out-of-stock' : ''}"
               data-id="${product.id}"
               aria-label="${product.name}">

        <div class="product-card__img-wrap">
          ${_badge(product.badge)}

          <button class="product-card__wish ${wished ? 'active' : ''}"
                  aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}"
                  onclick="ProductManager.toggleWishlist(${product.id}, this)">
            ${wished ? '❤️' : '🤍'}
          </button>

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.src='https://placehold.co/600x400/1a1a26/6366f1?text=Image'"
          />

          <div class="product-card__overlay">
            <button class="btn btn--primary btn--sm"
                    onclick="ProductManager.openModal(${product.id})">
              👁 Quick View
            </button>
          </div>
        </div>

        <div class="product-card__body">
          <p class="product-card__category">${product.category}</p>
          <h3 class="product-card__name">${product.name}</h3>

          <div class="product-card__stars" aria-label="Rating ${product.rating} out of 5">
            <span class="star">${_stars(product.rating)}</span>
            <span class="count">(${product.reviews.toLocaleString()})</span>
          </div>

          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="current">₹${product.price.toLocaleString('en-IN')}</span>
              ${product.originalPrice ? `<span class="original">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
              ${discount ? `<span class="badge badge--sale" style="font-size:0.65rem">-${discount}%</span>` : ''}
            </div>

            ${outOfStock
              ? `<span style="font-size:0.75rem;color:var(--clr-text-3);font-weight:600">Out of Stock</span>`
              : `<button class="product-card__add"
                         aria-label="Add ${product.name} to cart"
                         onclick="ProductManager.addToCart(${product.id}, this)">＋</button>`
            }
          </div>
        </div>
      </article>
    `;
  }

  /* ── Render grid ── */
  function renderGrid(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results__icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>`;
      return;
    }

    container.innerHTML = products.map(renderCard).join('');
  }

  /* ── Skeleton loaders ── */
  function renderSkeletons(containerId, count = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(count).fill(`
      <div class="skeleton-card">
        <div class="skeleton skeleton-card__img"></div>
        <div class="skeleton-card__body">
          <div class="skeleton skeleton-card__line skeleton-card__line--sm"></div>
          <div class="skeleton skeleton-card__line skeleton-card__line--lg"></div>
          <div class="skeleton skeleton-card__line skeleton-card__line--sm" style="width:40%"></div>
        </div>
      </div>`).join('');
  }

  /* ── Add to cart ── */
  function addToCart(id, btn) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    Cart.add(product);
    btn.textContent = '✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '＋'; btn.classList.remove('added'); }, 1200);
  }

  /* ── Wishlist ── */
  function toggleWishlist(id, btn) {
    const idx = wishlist.indexOf(id);
    if (idx === -1) {
      wishlist.push(id);
      btn.textContent = '❤️';
      btn.classList.add('active');
      Toast.show('Added to wishlist', 'success', '❤️');
    } else {
      wishlist.splice(idx, 1);
      btn.textContent = '🤍';
      btn.classList.remove('active');
      Toast.show('Removed from wishlist', '', '🤍');
    }
    localStorage.setItem('shopsphere-wishlist', JSON.stringify(wishlist));
    // refresh wishlist page if open
    if (typeof renderWishlistPage === 'function') renderWishlistPage();
  }

  function getWishlist() { return wishlist; }

  /* ── Quick-view modal ── */
  function openModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const overlay = document.getElementById('productModal');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${product.name}">
        <div class="modal__img-side">
          <button class="modal__close" aria-label="Close" onclick="ProductManager.closeModal()">✕</button>
          <img src="${product.image}" alt="${product.name}"
               onerror="this.src='https://placehold.co/600x800/1a1a26/6366f1?text=Image'" />
        </div>
        <div class="modal__content">
          <p class="modal__category">${product.category}</p>
          ${_badge(product.badge)}
          <h2 class="modal__name">${product.name}</h2>

          <div class="modal__rating">
            <span class="modal__stars">${_stars(product.rating)}</span>
            <span>${product.rating} · ${product.reviews.toLocaleString()} reviews</span>
          </div>

          <p class="modal__desc">${product.description}</p>

          <div class="modal__price">₹${product.price.toLocaleString('en-IN')}
            ${product.originalPrice ? `<span style="font-size:1rem;font-weight:400;color:var(--clr-text-3);text-decoration:line-through;margin-left:8px;-webkit-text-fill-color:var(--clr-text-3)">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>

          <div class="modal__specs">
            ${Object.entries(product.specs).map(([k,v]) => `
              <div class="modal__spec">
                <p class="modal__spec-label">${k}</p>
                <p class="modal__spec-val">${v}</p>
              </div>`).join('')}
          </div>

          <div class="modal__actions">
            ${product.inStock
              ? `<button class="btn btn--primary" style="flex:1"
                         onclick="Cart.add(PRODUCTS.find(p=>p.id===${id}));ProductManager.closeModal()">
                   🛒 Add to Cart
                 </button>`
              : `<button class="btn btn--ghost" style="flex:1" disabled>Out of Stock</button>`
            }
            <button class="btn btn--ghost"
                    onclick="ProductManager.toggleWishlist(${id}, this)"
                    aria-label="Wishlist">
              ${wishlist.includes(id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    }, { once: true });

    document.addEventListener('keydown', _escClose);
  }

  function closeModal() {
    const overlay = document.getElementById('productModal');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _escClose);
  }

  function _escClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  return { renderCard, renderGrid, renderSkeletons, addToCart, toggleWishlist, getWishlist, openModal, closeModal };
})();