/* ============================================
   ПроСкважинуНасосы — Main Application
   ============================================ */

(function () {
  'use strict';

  // ── STATE ──
  let products = [];
  let categories = {};
  let cart = [];
  let currentFilters = {
    brands: [],
    categories: [],
    priceMin: 0,
    priceMax: Infinity,
    search: '',
    sort: 'default',
    page: 1
  };
  const PER_PAGE = 20;

  // Brand metadata
  // Brand SVG logos
  const brandLogos = {
    'Belamos': '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="28" height="30" rx="3" fill="#E31E24" stroke="#1B3A6B" stroke-width="2"/><path d="M8 12h8v5H10v4h6v5H10v5H8V12z" fill="#fff"/><path d="M18 12h5l3 19h-4l-.5-3h-3l-.5 3h-4l4-19z" fill="#fff"/><text x="35" y="28" font-family="Arial,sans-serif" font-weight="bold" font-size="18" fill="#1B3A6B">BELAMOS</text></svg>',
    'Vodotok': '<svg viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg"><text x="5" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">V</text><text x="18" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">O</text><text x="33" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">D</text><text x="48" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#E31E24">O</text><text x="63" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">T</text><text x="76" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">O</text><text x="91" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="#1A47A0">K</text><path d="M15 5 Q20 0 25 5" stroke="#E31E24" stroke-width="2" fill="none"/><path d="M20 3 Q25 -2 30 3" stroke="#E31E24" stroke-width="1.5" fill="none"/></svg>',
    'ЭЦВ': '<svg viewBox="0 0 100 44" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ecvG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0077B6"/><stop offset="100%" stop-color="#023E8A"/></linearGradient></defs><circle cx="22" cy="22" r="20" fill="url(#ecvG)"/><path d="M12 14h10v3H16v3h6v3h-6v3h10v3H12V14z" fill="#fff"/><text x="48" y="20" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="#023E8A">ЭЦВ</text><text x="48" y="35" font-family="Arial,sans-serif" font-size="8" fill="#666">Ливнынасос</text></svg>',
    'Panelli': '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><path d="M15 8 Q25 2 30 12 Q35 22 25 20 Q15 18 20 28 Q25 38 15 32" stroke="#4A90D9" stroke-width="3" fill="none"/><circle cx="22" cy="15" r="6" fill="none" stroke="#4A90D9" stroke-width="2.5"/><text x="38" y="28" font-family="Arial,sans-serif" font-weight="bold" font-size="16" fill="#4A90D9" font-style="italic">PANELLI</text></svg>',
    'Aquastrong': '<svg viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="24" height="24" rx="4" fill="#1B5E20"/><text x="6" y="26" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="#fff">A</text><text x="30" y="27" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="#1B5E20">QUASTRONG</text><path d="M108 10 Q120 5 130 15" stroke="#4CAF50" stroke-width="2" fill="none"/></svg>'
  };

  const brandMeta = {
    'Belamos': { letter: 'B', count: 160, color: '#1B3A6B', logo: brandLogos['Belamos'] },
    'Vodotok': { letter: 'V', count: 143, color: '#1A47A0', logo: brandLogos['Vodotok'] },
    'ЭЦВ': { letter: 'Э', count: 200, color: '#023E8A', logo: brandLogos['ЭЦВ'] },
    'Panelli': { letter: 'P', count: 77, color: '#4A90D9', logo: brandLogos['Panelli'] },
    'Aquastrong': { letter: 'A', count: 62, color: '#1B5E20', logo: brandLogos['Aquastrong'] }
  };

  // ── ICONS ──
  const icons = {
    pump: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    placeholder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
  };

  // ── UTILITY ──
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function slugify(str) {
    return encodeURIComponent(str);
  }

  function deslugify(str) {
    return decodeURIComponent(str);
  }

  function placeholderImg() {
    return '<svg class="placeholder-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
  }

  function handleImgError(img) {
    img.style.display = 'none';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'placeholder-svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>';
    img.parentElement.appendChild(svg);
  }
  // Expose globally for onerror
  window.__handleImgError = handleImgError;

  function productImage(p) {
    if (p.image_url) {
      return '<img src="' + escapeHtml(p.image_url) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="window.__handleImgError(this)">';
    }
    return placeholderImg();
  }

  // ── TOAST ──
  let toastEl = null;
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  // ── SCROLL TO TOP BUTTON ──
  function initScrollTop() {
    let btn = $('#scrollTopBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scrollTopBtn';
      btn.className = 'scroll-top';
      btn.innerHTML = icons.chevronUp;
      btn.setAttribute('aria-label', 'Наверх');
      document.body.appendChild(btn);
      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // ── CART OPERATIONS ──
  function addToCart(productId, qty) {
    qty = qty || 1;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }
    updateCartBadge();
    showToast('Товар добавлен в корзину');
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartBadge();
  }

  function updateCartQty(productId, qty) {
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    updateCartBadge();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => {
      const p = products.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function updateCartBadge() {
    const badge = $('#cartBadge');
    const count = getCartCount();
    if (badge) {
      badge.textContent = count;
      badge.setAttribute('data-count', count);
      badge.classList.remove('bounce');
      void badge.offsetWidth;
      badge.classList.add('bounce');
    }
  }

  // ── FILTERING & SORTING ──
  function getFilteredProducts() {
    let filtered = products.slice();

    // Search
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (currentFilters.brands.length > 0) {
      filtered = filtered.filter(p => currentFilters.brands.includes(p.brand));
    }

    // Category filter
    if (currentFilters.categories.length > 0) {
      filtered = filtered.filter(p => currentFilters.categories.includes(p.category));
    }

    // Price filter
    filtered = filtered.filter(p =>
      p.price >= currentFilters.priceMin && p.price <= currentFilters.priceMax
    );

    // Sort
    switch (currentFilters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
        break;
    }

    return filtered;
  }

  function getAllCategories() {
    const cats = {};
    products.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }

  function getAllBrands() {
    const brands = {};
    products.forEach(p => {
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    });
    return Object.entries(brands).sort((a, b) => b[1] - a[1]);
  }

  function getPriceRange() {
    if (products.length === 0) return { min: 0, max: 100000 };
    const prices = products.map(p => p.price).filter(p => p > 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }

  // ── RENDERING ──
  const app = $('#app');

  function render(html) {
    app.innerHTML = `<div class="page-enter">${html}</div>`;
    window.scrollTo(0, 0);
  }

  // ── HOME PAGE ──
  function renderHome() {
    const allCats = getAllCategories();
    const topCats = allCats.slice(0, 8);

    const categoryIcons = [icons.drop, icons.pump, icons.shield, icons.truck, icons.star, icons.headphones, icons.clock, icons.award];

    const brandsHtml = Object.entries(brandMeta).map(([name, meta]) => `
      <a href="#/brand/${slugify(name)}" class="brand-card">
        <div class="brand-card__logo">${meta.logo}</div>
        <div class="brand-card__count">${meta.count} товаров</div>
      </a>
    `).join('');

    const catsHtml = topCats.map(([cat, count], i) => `
      <a href="#/catalog?category=${slugify(cat)}" class="category-card">
        <div class="category-card__icon">${categoryIcons[i % categoryIcons.length]}</div>
        <div>
          <div class="category-card__name">${escapeHtml(cat)}</div>
          <div class="category-card__count">${count} товаров</div>
        </div>
      </a>
    `).join('');

    render(`
      <section class="hero">
        <div class="container hero__inner">
          <div class="hero__content">
            <div class="hero__badge">
              <span>★</span> Более 640 товаров в каталоге
            </div>
            <h1 class="hero__title">
              Надёжные <span>насосы</span><br>для вашей скважины
            </h1>
            <p class="hero__subtitle">
              ПроСкважинуНасосы — ваш эксперт по насосному оборудованию для скважин. 
              Подберём оптимальное решение для вашей скважины в Перми и Пермском крае.
            </p>
            <div class="hero__actions">
              <a href="#/catalog" class="btn btn--primary btn--lg">Перейти в каталог</a>
              <a href="#/contacts" class="btn btn--outline btn--lg">Связаться с нами</a>
            </div>
          </div>
          <div class="hero__visual">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" fill="#E6F4FA" opacity="0.5"/>
              <circle cx="200" cy="200" r="120" fill="#90E0EF" opacity="0.2"/>
              <rect x="170" y="60" width="60" height="200" rx="8" fill="#0077B6" opacity="0.9"/>
              <rect x="178" y="80" width="44" height="40" rx="4" fill="white" opacity="0.3"/>
              <rect x="178" y="130" width="44" height="6" rx="3" fill="white" opacity="0.2"/>
              <rect x="178" y="142" width="44" height="6" rx="3" fill="white" opacity="0.2"/>
              <path d="M160 260h80v20c0 8-8 16-16 16h-48c-8 0-16-8-16-16v-20z" fill="#005F8A"/>
              <rect x="190" y="276" width="20" height="60" rx="4" fill="#0077B6"/>
              <circle cx="200" cy="356" r="16" fill="#00B4D8" opacity="0.3"/>
              <circle cx="200" cy="356" r="8" fill="#0077B6"/>
              <!-- Water drops -->
              <path d="M120 180c0 8-12 20-12 20s-12-12-12-20a12 12 0 0 1 24 0z" fill="#90E0EF" opacity="0.6"/>
              <path d="M300 140c0 6-8 14-8 14s-8-8-8-14a8 8 0 0 1 16 0z" fill="#90E0EF" opacity="0.4"/>
              <path d="M280 220c0 10-14 22-14 22s-14-12-14-22a14 14 0 0 1 28 0z" fill="#90E0EF" opacity="0.5"/>
              <!-- Waves -->
              <path d="M80 320c20-10 40 10 60 0s40-10 60 0 40 10 60 0 40-10 60 0" stroke="#0077B6" stroke-width="2" opacity="0.2" fill="none"/>
              <path d="M80 340c20-10 40 10 60 0s40-10 60 0 40 10 60 0 40-10 60 0" stroke="#0077B6" stroke-width="2" opacity="0.12" fill="none"/>
            </svg>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section__header">
            <h2 class="section__title">Наши бренды</h2>
            <p class="section__subtitle">Работаем с проверенными производителями насосного оборудования</p>
          </div>
          <div class="brands-grid">${brandsHtml}</div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="section__header">
            <h2 class="section__title">Популярные категории</h2>
            <p class="section__subtitle">Найдите нужное оборудование по категориям</p>
          </div>
          <div class="categories-grid">${catsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section__header">
            <h2 class="section__title">Почему выбирают нас</h2>
            <p class="section__subtitle">ПроСкважинуНасосы — ваш надёжный партнёр в Перми</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-card__icon">${icons.shield}</div>
              <div class="feature-card__title">Гарантия качества</div>
              <div class="feature-card__desc">Только оригинальное оборудование с гарантией от производителя до 5 лет</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">${icons.truck}</div>
              <div class="feature-card__title">Быстрая доставка</div>
              <div class="feature-card__desc">Доставка по Перми за 1 день. Отправка по всей России транспортными компаниями</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">${icons.headphones}</div>
              <div class="feature-card__title">Консультации</div>
              <div class="feature-card__desc">Бесплатная помощь в подборе оборудования от наших специалистов</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">${icons.star}</div>
              <div class="feature-card__title">Лучшие цены</div>
              <div class="feature-card__desc">Прямые поставки от производителей обеспечивают конкурентные цены</div>
            </div>
          </div>
        </div>
      </section>
    `);
  }

  // ── CATALOG PAGE ──
  function renderCatalog(opts) {
    opts = opts || {};

    // Apply brand filter from URL
    if (opts.brand) {
      currentFilters.brands = [opts.brand];
    }
    if (opts.category) {
      currentFilters.categories = [opts.category];
    }

    const allBrands = getAllBrands();
    const allCats = getAllCategories();
    const priceRange = getPriceRange();

    if (currentFilters.priceMax === Infinity) {
      currentFilters.priceMax = priceRange.max;
    }

    const brandsChecks = allBrands.map(([brand, count]) => `
      <label class="filters__checkbox">
        <input type="checkbox" value="${escapeHtml(brand)}" ${currentFilters.brands.includes(brand) ? 'checked' : ''} data-filter="brand">
        <span>${escapeHtml(brand)}</span>
        <span class="filters__checkbox-count">${count}</span>
      </label>
    `).join('');

    const catsChecks = allCats.map(([cat, count]) => `
      <label class="filters__checkbox">
        <input type="checkbox" value="${escapeHtml(cat)}" ${currentFilters.categories.includes(cat) ? 'checked' : ''} data-filter="category">
        <span>${escapeHtml(cat)}</span>
        <span class="filters__checkbox-count">${count}</span>
      </label>
    `).join('');

    const pageTitle = opts.brand
      ? `Бренд: ${escapeHtml(opts.brand)}`
      : 'Каталог';

    render(`
      <div class="container">
        <div class="catalog">
          <aside class="catalog__sidebar" id="catalogSidebar">
            <div class="filters">
              <div class="filters__group">
                <span class="filters__label">Бренд</span>
                ${brandsChecks}
              </div>
              <div class="filters__group">
                <span class="filters__label">Категория</span>
                ${catsChecks}
              </div>
              <div class="filters__group">
                <span class="filters__label">Цена, ₽</span>
                <div class="price-range">
                  <div class="price-range__inputs">
                    <input type="number" class="price-range__input" id="priceMin" value="${currentFilters.priceMin || priceRange.min}" min="${priceRange.min}" max="${priceRange.max}" placeholder="от">
                    <span class="price-range__sep">—</span>
                    <input type="number" class="price-range__input" id="priceMax" value="${currentFilters.priceMax || priceRange.max}" min="${priceRange.min}" max="${priceRange.max}" placeholder="до">
                  </div>
                </div>
              </div>
              <button class="btn btn--primary btn--full filters__apply" id="applyFilters">Показать товары</button>
              <button class="filters__reset" id="resetFilters">Сбросить фильтры</button>
            </div>
          </aside>
          <div class="catalog__main">
            <button class="btn btn--outline btn--full catalog__filter-toggle" id="filterToggle">
              ${icons.filter} Фильтры
            </button>
            <div class="catalog__toolbar">
              <div class="catalog__count" id="catalogCount"></div>
              <div class="catalog__sort">
                <span class="catalog__sort-label">Сортировка:</span>
                <select id="sortSelect">
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Сначала дешёвые</option>
                  <option value="price-desc">Сначала дорогие</option>
                  <option value="name-asc">По названию А–Я</option>
                  <option value="name-desc">По названию Я–А</option>
                </select>
              </div>
            </div>
            <div class="products-grid" id="productsGrid"></div>
            <div class="pagination" id="pagination"></div>
          </div>
        </div>
      </div>
    `);

    // Set sort value
    const sortSel = $('#sortSelect');
    if (sortSel) sortSel.value = currentFilters.sort;

    // Bind events
    bindCatalogEvents();
    updateProductGrid();
  }

  function bindCatalogEvents() {
    // Brand checkboxes
    $$('[data-filter="brand"]').forEach(cb => {
      cb.addEventListener('change', () => {
        currentFilters.brands = $$('[data-filter="brand"]:checked').map(el => el.value);
        currentFilters.page = 1;
        updateProductGrid();
      });
    });

    // Category checkboxes
    $$('[data-filter="category"]').forEach(cb => {
      cb.addEventListener('change', () => {
        currentFilters.categories = $$('[data-filter="category"]:checked').map(el => el.value);
        currentFilters.page = 1;
        updateProductGrid();
      });
    });

    // Price range
    const priceMin = $('#priceMin');
    const priceMax = $('#priceMax');
    if (priceMin && priceMax) {
      const handlePrice = () => {
        currentFilters.priceMin = parseInt(priceMin.value) || 0;
        currentFilters.priceMax = parseInt(priceMax.value) || Infinity;
        currentFilters.page = 1;
        updateProductGrid();
      };
      priceMin.addEventListener('change', handlePrice);
      priceMax.addEventListener('change', handlePrice);
    }

    // Sort
    const sortSel = $('#sortSelect');
    if (sortSel) {
      sortSel.addEventListener('change', () => {
        currentFilters.sort = sortSel.value;
        currentFilters.page = 1;
        updateProductGrid();
      });
    }

    // Apply button
    const applyBtn = $('#applyFilters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // Gather all filters
        currentFilters.brands = $$('[data-filter="brand"]:checked').map(el => el.value);
        currentFilters.categories = $$('[data-filter="category"]:checked').map(el => el.value);
        const pm = $('#priceMin');
        const px = $('#priceMax');
        if (pm) currentFilters.priceMin = parseInt(pm.value) || 0;
        if (px) currentFilters.priceMax = parseInt(px.value) || Infinity;
        currentFilters.page = 1;
        updateProductGrid();
        // Close mobile sidebar if open
        const sb = $('#catalogSidebar');
        if (sb) sb.classList.remove('open');
        // Scroll to products
        const grid = $('#productsGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Reset
    const resetBtn = $('#resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilters.brands = [];
        currentFilters.categories = [];
        currentFilters.priceMin = 0;
        currentFilters.priceMax = Infinity;
        currentFilters.search = '';
        currentFilters.sort = 'default';
        currentFilters.page = 1;
        renderCatalog();
      });
    }

    // Filter toggle (mobile)
    const filterToggle = $('#filterToggle');
    const sidebar = $('#catalogSidebar');
    if (filterToggle && sidebar) {
      filterToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        filterToggle.textContent = sidebar.classList.contains('open') ? 'Скрыть фильтры' : 'Фильтры';
      });
    }
  }

  function updateProductGrid() {
    const filtered = getFilteredProducts();
    const total = filtered.length;
    const totalPages = Math.ceil(total / PER_PAGE);
    const page = Math.min(currentFilters.page, totalPages || 1);
    const start = (page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    // Update count
    const countEl = $('#catalogCount');
    if (countEl) {
      countEl.innerHTML = `Найдено: <strong>${total}</strong> товаров`;
    }

    // Render products
    const grid = $('#productsGrid');
    if (grid) {
      if (pageItems.length === 0) {
        grid.innerHTML = `
          <div class="no-results" style="grid-column: 1 / -1;">
            <div class="no-results__icon">${icons.search}</div>
            <div class="no-results__title">Товары не найдены</div>
            <p>Попробуйте изменить параметры фильтрации</p>
          </div>
        `;
      } else {
        grid.innerHTML = pageItems.map(p => renderProductCard(p)).join('');
      }
    }

    // Bind add-to-cart buttons
    $$('.product-card__add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(btn.dataset.id);
      });
    });

    // Bind card clicks
    $$('.product-card__image, .product-card__name').forEach(el => {
      el.addEventListener('click', () => {
        window.location.hash = '#/product/' + el.dataset.id;
      });
    });

    // Render pagination
    renderPagination(page, totalPages);
  }

  function renderProductCard(p) {
    return `
      <div class="product-card">
        <div class="product-card__image" data-id="${p.id}">
          ${productImage(p)}
        </div>
        <div class="product-card__body">
          <div class="product-card__brand">${escapeHtml(p.brand)}</div>
          <div class="product-card__name" data-id="${p.id}">${escapeHtml(p.name)}</div>
        </div>
        <div class="product-card__footer">
          <div class="product-card__price">${p.price_formatted}</div>
          <button class="product-card__add-btn" data-id="${p.id}" aria-label="Добавить в корзину">
            ${icons.plus}
          </button>
        </div>
      </div>
    `;
  }

  function renderPagination(current, total) {
    const pag = $('#pagination');
    if (!pag || total <= 1) {
      if (pag) pag.innerHTML = '';
      return;
    }

    let pages = [];
    const delta = 2;

    pages.push(1);
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      pages.push(i);
    }
    if (total > 1) pages.push(total);

    // Dedupe and sort
    pages = [...new Set(pages)].sort((a, b) => a - b);

    let html = '';
    html += `<button class="pagination__btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>←</button>`;

    let lastPage = 0;
    pages.forEach(p => {
      if (p - lastPage > 1) {
        html += `<span class="pagination__dots">…</span>`;
      }
      html += `<button class="pagination__btn ${p === current ? 'active' : ''}" data-page="${p}">${p}</button>`;
      lastPage = p;
    });

    html += `<button class="pagination__btn" data-page="${current + 1}" ${current === total ? 'disabled' : ''}>→</button>`;

    pag.innerHTML = html;

    $$('.pagination__btn', pag).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        currentFilters.page = parseInt(btn.dataset.page);
        updateProductGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // ── PRODUCT DETAIL PAGE ──
  function renderProduct(id) {
    const p = products.find(pr => pr.id === id);
    if (!p) {
      render(`<div class="container" style="padding:80px 0;text-align:center;">
        <h2>Товар не найден</h2>
        <p style="color:var(--text-muted);margin:16px 0;">Возможно, товар был удалён или ссылка неверна</p>
        <a href="#/catalog" class="btn btn--primary">Перейти в каталог</a>
      </div>`);
      return;
    }

    const specsHtml = p.specs && Object.keys(p.specs).length > 0
      ? Object.entries(p.specs)
        .filter(([key]) => !key.startsWith('с ') && !key.includes('Безналичный'))
        .map(([key, val]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(val)}</td></tr>`)
        .join('')
      : '';

    render(`
      <div class="container product-detail">
        <div class="breadcrumbs">
          <a href="#/">Главная</a>
          <span class="breadcrumbs__sep">›</span>
          <a href="#/catalog">Каталог</a>
          <span class="breadcrumbs__sep">›</span>
          <a href="#/brand/${slugify(p.brand)}">${escapeHtml(p.brand)}</a>
          <span class="breadcrumbs__sep">›</span>
          <span>${escapeHtml(p.name)}</span>
        </div>

        <div class="product-detail__grid">
          <div class="product-detail__image">
            ${productImage(p)}
          </div>
          <div class="product-detail__info">
            <div class="product-detail__brand">${escapeHtml(p.brand)}</div>
            <h1 class="product-detail__name">${escapeHtml(p.name)}</h1>
            <div class="product-detail__price">${p.price_formatted}</div>
            <div class="product-detail__actions">
              <div class="product-detail__qty">
                <button id="qtyMinus">−</button>
                <span id="qtyVal">1</span>
                <button id="qtyPlus">+</button>
              </div>
              <button class="btn btn--primary btn--lg" id="addToCartBtn">
                ${icons.cart} В корзину
              </button>
            </div>

            ${specsHtml ? `
            <div class="specs-table">
              <h3 class="specs-table__title">Характеристики</h3>
              <table>${specsHtml}</table>
            </div>
            ` : ''}

            ${p.description ? `
            <div class="product-detail__desc">
              <h3 class="product-detail__desc-title">Описание</h3>
              <p class="product-detail__desc-text">${escapeHtml(p.description).substring(0, 500)}${p.description.length > 500 ? '...' : ''}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `);

    // Bind quantity controls
    let qty = 1;
    const qtyVal = $('#qtyVal');
    $('#qtyMinus').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyVal.textContent = qty;
    });
    $('#qtyPlus').addEventListener('click', () => {
      qty++;
      qtyVal.textContent = qty;
    });
    $('#addToCartBtn').addEventListener('click', () => {
      addToCart(p.id, qty);
    });
  }

  // ── CART PAGE ──
  function renderCart() {
    if (cart.length === 0) {
      render(`
        <div class="container cart-page">
          <h1 class="cart-page__title">Корзина</h1>
          <div class="cart-empty">
            <div class="cart-empty__icon">${icons.cart}</div>
            <h2 class="cart-empty__title">Корзина пуста</h2>
            <p class="cart-empty__text">Добавьте товары из каталога, чтобы оформить заказ</p>
            <a href="#/catalog" class="btn btn--primary">Перейти в каталог</a>
          </div>
        </div>
      `);
      return;
    }

    const itemsHtml = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item__image">
            ${productImage(p)}
          </div>
          <div class="cart-item__info">
            <div class="cart-item__name"><a href="#/product/${p.id}">${escapeHtml(p.name)}</a></div>
            <div class="cart-item__brand">${escapeHtml(p.brand)} · ${escapeHtml(p.category)}</div>
            <div class="cart-item__controls">
              <div class="cart-item__qty">
                <button class="cart-qty-minus" data-id="${p.id}">−</button>
                <span>${item.qty}</span>
                <button class="cart-qty-plus" data-id="${p.id}">+</button>
              </div>
              <button class="btn btn--danger btn--sm cart-remove" data-id="${p.id}">
                ${icons.trash} Удалить
              </button>
              <div class="cart-item__price">${formatPrice(p.price * item.qty)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const totalCount = getCartCount();
    const totalPrice = getCartTotal();

    render(`
      <div class="container cart-page">
        <h1 class="cart-page__title">Корзина</h1>
        <div class="cart-page__grid">
          <div class="cart-items">${itemsHtml}</div>
          <div class="cart-summary" id="cartSummary">
            <h3 class="cart-summary__title">Итого</h3>
            <div class="cart-summary__row">
              <span>Товаров:</span>
              <span>${totalCount} шт.</span>
            </div>
            <div class="cart-summary__row cart-summary__row--total">
              <span>Сумма:</span>
              <span>${formatPrice(totalPrice)}</span>
            </div>
            <div class="order-form" id="orderForm">
              <h4 class="order-form__title">Оформление заказа</h4>
              <div class="form-group">
                <label for="orderName">Имя *</label>
                <input type="text" id="orderName" placeholder="Ваше имя" required>
              </div>
              <div class="form-group">
                <label for="orderPhone">Телефон *</label>
                <input type="tel" id="orderPhone" placeholder="+7 (___) ___-__-__" required>
              </div>
              <div class="form-group">
                <label for="orderEmail">Email</label>
                <input type="email" id="orderEmail" placeholder="email@example.com">
              </div>
              <div class="form-group">
                <label for="orderAddress">Адрес доставки</label>
                <input type="text" id="orderAddress" placeholder="Город, улица, дом">
              </div>
              <div class="form-group">
                <label for="orderComment">Комментарий</label>
                <textarea id="orderComment" placeholder="Дополнительная информация к заказу"></textarea>
              </div>
              <button class="btn btn--primary btn--full btn--lg" id="submitOrder" style="margin-top:16px;">
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    // Bind cart item events
    $$('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id);
        if (item && item.qty > 1) {
          updateCartQty(btn.dataset.id, item.qty - 1);
          renderCart();
        }
      });
    });

    $$('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id);
        if (item) {
          updateCartQty(btn.dataset.id, item.qty + 1);
          renderCart();
        }
      });
    });

    $$('.cart-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        renderCart();
      });
    });

    // Submit order
    const submitBtn = $('#submitOrder');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = $('#orderName').value.trim();
        const phone = $('#orderPhone').value.trim();
        if (!name || !phone) {
          showToast('Заполните обязательные поля: Имя и Телефон');
          return;
        }
        cart = [];
        updateCartBadge();
        const summary = $('#cartSummary');
        if (summary) {
          summary.innerHTML = `
            <div class="order-success">
              <div class="order-success__icon">${icons.check}</div>
              <h3 class="order-success__title">Заказ оформлен!</h3>
              <p class="order-success__text">Спасибо за заказ, ${escapeHtml(name)}! Наш менеджер свяжется с вами по телефону ${escapeHtml(phone)} для подтверждения.</p>
              <a href="#/catalog" class="btn btn--primary">Продолжить покупки</a>
            </div>
          `;
        }
        // Clear the items
        const items = $('.cart-items');
        if (items) items.innerHTML = '';
      });
    }
  }

  // ── BRANDS PAGE ──
  function renderBrands() {
    const brandsHtml = Object.entries(brandMeta).map(([name, meta]) => {
      const brandCats = categories[name] || {};
      const catsText = Object.keys(brandCats).join(', ');
      return `
        <a href="#/brand/${slugify(name)}" class="brand-page-card">
          <div class="brand-page-card__logo">${meta.logo}</div>
          <div class="brand-page-card__count">${meta.count} товаров</div>
          <div class="brand-page-card__categories">${escapeHtml(catsText)}</div>
        </a>
      `;
    }).join('');

    render(`
      <div class="container brands-page">
        <h1 class="brands-page__title">Бренды</h1>
        <p class="brands-page__subtitle">Мы предлагаем оборудование от 5 проверенных производителей</p>
        <div class="brands-page__grid">${brandsHtml}</div>
      </div>
    `);
  }

  // ── ABOUT PAGE ──
  function renderAbout() {
    render(`
      <div class="container info-page">
        <h1 class="info-page__title">О компании ПроСкважинуНасосы</h1>
        <p class="info-page__subtitle">ПроСкважинуНасосы — бурение и обустройство скважин на воду в Перми и Пермском крае. Подбор и продажа насосного оборудования.</p>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-card__icon">${icons.award}</div>
            <h3 class="info-card__title">Многолетний опыт</h3>
            <p class="info-card__text">Наша команда имеет многолетний опыт работы в сфере водоснабжения и насосного оборудования. Мы знаем всё о скважинах и подберём оптимальное решение для любых условий эксплуатации.</p>
          </div>
          <div class="info-card">
            <div class="info-card__icon">${icons.shield}</div>
            <h3 class="info-card__title">Оригинальная продукция</h3>
            <p class="info-card__text">Мы работаем напрямую с производителями и официальными дистрибьюторами. Каждый товар в нашем каталоге — оригинальная продукция с полной гарантией и сертификацией.</p>
          </div>
          <div class="info-card">
            <div class="info-card__icon">${icons.truck}</div>
            <h3 class="info-card__title">Доставка по России</h3>
            <p class="info-card__text">Осуществляем доставку по Перми и Пермскому краю в кратчайшие сроки. Также отправляем заказы по всей России через надёжные транспортные компании.</p>
          </div>
          <div class="info-card">
            <div class="info-card__icon">${icons.headphones}</div>
            <h3 class="info-card__title">Техническая поддержка</h3>
            <p class="info-card__text">Наши специалисты всегда готовы помочь с выбором оборудования, расчётом параметров скважины и консультацией по монтажу и обслуживанию насосного оборудования.</p>
          </div>
        </div>

        <div class="section__header" style="margin-top: 32px;">
          <h2 class="section__title">Наш каталог</h2>
          <p class="section__subtitle">Более 640 товаров от 5 ведущих производителей</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-card__icon" style="font-size:1.5rem;font-weight:800;color:var(--primary);">640+</div>
            <div class="feature-card__title">Товаров</div>
            <div class="feature-card__desc">Широкий ассортимент насосного оборудования</div>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon" style="font-size:1.5rem;font-weight:800;color:var(--primary);">5</div>
            <div class="feature-card__title">Брендов</div>
            <div class="feature-card__desc">Проверенные производители</div>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon" style="font-size:1.5rem;font-weight:800;color:var(--primary);">15+</div>
            <div class="feature-card__title">Категорий</div>
            <div class="feature-card__desc">Все виды насосного оборудования</div>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon" style="font-size:1.5rem;font-weight:800;color:var(--primary);">24/7</div>
            <div class="feature-card__title">Онлайн</div>
            <div class="feature-card__desc">Каталог доступен круглосуточно</div>
          </div>
        </div>
      </div>
    `);
  }

  // ── CONTACTS PAGE ──
  function renderContacts() {
    render(`
      <div class="container info-page">
        <h1 class="info-page__title">Контакты</h1>
        <p class="info-page__subtitle">Свяжитесь с нами для консультации или оформления заказа</p>

        <div class="contact-details">
          <div class="contact-card">
            <div class="contact-card__icon">${icons.phone}</div>
            <div class="contact-card__label">Телефон</div>
            <div class="contact-card__value"><a href="tel:+79952782562">+7 (995) 278-25-62</a></div>
          </div>
          <div class="contact-card">
            <div class="contact-card__icon">${icons.mail}</div>
            <div class="contact-card__label">Email</div>
            <div class="contact-card__value"><a href="mailto:Petrokom-pm@mail.ru">Petrokom-pm@mail.ru</a></div>
          </div>
          <div class="contact-card">
            <div class="contact-card__icon">${icons.mapPin}</div>
            <div class="contact-card__label">Адрес</div>
            <div class="contact-card__value">г. Пермь, ул. Челюскинцев, д. 23, офис 8</div>
          </div>
        </div>

        <div class="contacts-social">
          <h3 class="contacts-social__title">Мы в социальных сетях</h3>
          <div class="contacts-social__links">
            <a href="https://t.me/proskvajiny" target="_blank" rel="noopener" class="contacts-social__link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
            <a href="https://wa.me/79952782562" target="_blank" rel="noopener" class="contacts-social__link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="https://vk.com" target="_blank" rel="noopener" class="contacts-social__link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.547 7H16.86a.47.47 0 0 0-.395.228c-.483.736-.971 1.467-1.455 2.201-.67 1.015-1.102 1.276-1.394 1.276-.21 0-.405-.157-.405-.73V7.47A.47.47 0 0 0 12.741 7H9.87c-.258 0-.41.192-.41.375 0 .394.59.485.59 1.596v2.412c0 .53-.096.626-.305.626-.59 0-2.025-2.166-2.877-4.645A.476.476 0 0 0 6.415 7H3.552a.47.47 0 0 0-.47.47v.048c0 .393 2.26 6.545 5.097 8.942C10.38 18.417 12.907 19 15.128 19c1.338 0 1.503-.3 1.503-.817v-2.01a.47.47 0 0 1 .47-.473h.047c.272 0 .708.108 1.396.76.758.73 1.347 1.737 1.347 1.737A.47.47 0 0 0 20.29 19h2.84a.47.47 0 0 0 .42-.672s-1.085-1.693-1.917-2.706c-.526-.64-1.1-1.34-1.252-1.516-.272-.329-.197-.476 0-.769 0 0 2.122-2.99 2.344-4.003.074-.337-.197-.334-.178-.334z"/></svg>
              ВКонтакте
            </a>
          </div>
          <p class="contacts-social__site">Сайт: <a href="https://про-скважину.рф" target="_blank" rel="noopener">про-скважину.рф</a></p>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-card__icon">${icons.clock}</div>
            <h3 class="info-card__title">Режим работы</h3>
            <p class="info-card__text">
              Понедельник — Воскресенье: 09:00 – 18:00<br><br>
              Онлайн-заказы принимаются круглосуточно
            </p>
          </div>
          <div class="info-card">
            <div class="info-card__icon">${icons.truck}</div>
            <h3 class="info-card__title">Доставка</h3>
            <p class="info-card__text">
              По Перми — от 1 рабочего дня<br>
              По Пермскому краю — от 2 рабочих дней<br>
              По России — от 3 рабочих дней<br><br>
              Самовывоз со склада по предварительной договорённости
            </p>
          </div>
        </div>

        <div class="map-section">
          <h2 class="map-section__title">Как нас найти</h2>
          <div class="map-container" id="yandexMapContainer" style="height:420px;"></div>
        </div>
      </div>
    `);

    // Init Yandex Map after render
    initYandexMap();
  }

  function initYandexMap() {
    var container = document.getElementById('yandexMapContainer');
    if (!container) return;

    function createMap() {
      if (typeof ymaps === 'undefined') return;
      ymaps.ready(function() {
        // Clear previous map if exists
        container.innerHTML = '';
        var map = new ymaps.Map(container, {
          center: [57.986159, 56.231321],
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });
        var placemark = new ymaps.Placemark([57.986159, 56.231321], {
          balloonContentHeader: '\u041f\u0440\u043e\u0421\u043a\u0432\u0430\u0436\u0438\u043d\u0443\u041d\u0430\u0441\u043e\u0441\u044b',
          balloonContentBody: '\u0433. \u041f\u0435\u0440\u043c\u044c, \u041f\u0435\u0440\u043c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439<br>+7 (995) 278-25-62',
          hintContent: '\u041f\u0440\u043e\u0421\u043a\u0432\u0430\u0436\u0438\u043d\u0443\u041d\u0430\u0441\u043e\u0441\u044b'
        }, {
          preset: 'islands#blueWaterIcon'
        });
        map.geoObjects.add(placemark);
      });
    }

    if (typeof ymaps !== 'undefined') {
      createMap();
    } else if (!document.getElementById('ya-map-api')) {
      var s = document.createElement('script');
      s.id = 'ya-map-api';
      s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      s.onload = createMap;
      document.head.appendChild(s);
    } else {
      // Script loading, wait
      var check = setInterval(function() {
        if (typeof ymaps !== 'undefined') {
          clearInterval(check);
          createMap();
        }
      }, 200);
    }
  }

  // ── ROUTER ──
  function route() {
    const hash = window.location.hash || '#/';
    const parts = hash.replace('#', '').split('?');
    const path = parts[0];
    const params = new URLSearchParams(parts[1] || '');

    // Close mobile nav on route change
    const mobileNav = $('#mobileNav');
    const burger = $('#burgerBtn');
    if (mobileNav) mobileNav.classList.remove('open');
    if (burger) burger.classList.remove('active');

    // Highlight active nav
    $$('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', hash.startsWith(href));
    });

    if (path === '/' || path === '') {
      resetFilters();
      renderHome();
    } else if (path === '/catalog') {
      const category = params.get('category') ? deslugify(params.get('category')) : null;
      if (category) {
        resetFilters();
        renderCatalog({ category });
      } else {
        renderCatalog();
      }
    } else if (path.startsWith('/product/')) {
      const id = path.split('/product/')[1];
      renderProduct(id);
    } else if (path === '/cart') {
      renderCart();
    } else if (path === '/brands') {
      renderBrands();
    } else if (path.startsWith('/brand/')) {
      const brandName = deslugify(path.split('/brand/')[1]);
      resetFilters();
      renderCatalog({ brand: brandName });
    } else if (path === '/about') {
      renderAbout();
    } else if (path === '/contacts') {
      renderContacts();
    } else {
      render(`<div class="container" style="padding:80px 0;text-align:center;">
        <h2>Страница не найдена</h2>
        <p style="color:var(--text-muted);margin:16px 0;">Запрашиваемая страница не существует</p>
        <a href="#/" class="btn btn--primary">На главную</a>
      </div>`);
    }
  }

  function resetFilters() {
    currentFilters = {
      brands: [],
      categories: [],
      priceMin: 0,
      priceMax: Infinity,
      search: '',
      sort: 'default',
      page: 1
    };
  }

  // ── SEARCH ──
  function handleSearch(query) {
    if (query.trim()) {
      resetFilters();
      currentFilters.search = query.trim();
      window.location.hash = '#/catalog';
      // Small delay to let route render, then update with search
      setTimeout(() => {
        renderCatalog();
      }, 50);
    }
  }

  // ── HEADER SCROLL ──
  function initHeaderScroll() {
    const header = $('#header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    });
  }

  // ── BURGER MENU ──
  function initBurger() {
    const burger = $('#burgerBtn');
    const mobileNav = $('#mobileNav');
    if (burger && mobileNav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      $$('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ── SEARCH BINDINGS ──
  function initSearch() {
    const searchInput = $('#searchInput');
    const searchBtn = $('#searchBtn');
    const mobileSearchInput = $('#mobileSearchInput');

    if (searchInput && searchBtn) {
      searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch(searchInput.value);
      });
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch(mobileSearchInput.value);
          const burger = $('#burgerBtn');
          const mobileNav = $('#mobileNav');
          if (burger) burger.classList.remove('active');
          if (mobileNav) mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ── BASE URL ──
  // Determine the base URL dynamically for proper asset loading in any hosting environment
  function getBaseUrl() {
    // Try to get base from current script src
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src.includes('app.js')) {
        return s.src.replace(/js\/app\.js.*$/, '');
      }
    }
    // Try from document URL (handle hash routing)
    const loc = window.location.href.split('#')[0].split('?')[0];
    // If URL ends with index.html or /, use that directory
    if (loc.endsWith('/')) return loc;
    // Remove filename
    return loc.substring(0, loc.lastIndexOf('/') + 1);
  }
  const BASE_URL = getBaseUrl();

  // ── INIT ──
  async function init() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(BASE_URL + 'data/products.json'),
        fetch(BASE_URL + 'data/categories.json')
      ]);

      if (!productsRes.ok) throw new Error('Products HTTP ' + productsRes.status);
      if (!categoriesRes.ok) throw new Error('Categories HTTP ' + categoriesRes.status);
      products = await productsRes.json();
      categories = await categoriesRes.json();

      // Initialize UI
      initHeaderScroll();
      initBurger();
      initSearch();
      initScrollTop();

      // Listen for hash changes
      window.addEventListener('hashchange', route);

      // Initial route
      route();

    } catch (err) {
      console.error('Failed to load data:', err);
      app.innerHTML = `
        <div style="text-align:center;padding:80px 20px;">
          <h2>Ошибка загрузки</h2>
          <p style="color:var(--text-muted);margin:16px 0;">Не удалось загрузить каталог товаров. Попробуйте обновить страницу.</p>
          <button onclick="location.reload()" class="btn btn--primary">Обновить</button>
        </div>
      `;
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
