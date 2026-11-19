/* ============================================================
   MAKEUP DATE · shared header / footer renderer
   ============================================================ */

const NAV_LINKS = [
  { href: 'index.html', label: '首页' },
  { href: 'styles.html', label: '妆造风格' },
  { href: 'artists.html', label: '妆娘列表' },
  { href: 'portfolio.html', label: '作品集' },
  { href: 'about.html', label: '关于我们' },
  { href: 'reviews.html', label: '客户评价' },
  { href: 'faq.html', label: '常见问题' },
];

function renderNav(active = '') {
  const cur = active || (location.pathname.split('/').pop() || 'index.html');
  return `
  <header class="nav">
    <div class="nav-in">
      <a class="logo" href="index.html" aria-label="MAKEUP DATE 首页">
        <span class="logo-mark">M</span>
        <span class="logo-text">MAKEUP DATE<small>妆造预约平台</small></span>
      </a>
      <nav class="nav-links">
        ${NAV_LINKS.map(
          (l) => `<a href="${l.href}" class="${cur === l.href ? 'active' : ''}">${l.label}</a>`
        ).join('')}
      </nav>
      <div class="nav-right">
        <a href="booking-guide.html" class="nav-icon hide-mobile" title="预约须知" aria-label="预约须知">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 11.5h1V16h1" stroke-linecap="round"/></svg>
        </a>
        <a href="booking.html" class="btn btn-dark nav-auth">立即预约</a>
        <a href="artists.html" class="nav-icon" aria-label="筛选妆娘">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5" stroke-linecap="round"/></svg>
        </a>
        <button class="burger" id="burger" aria-label="打开菜单">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </header>
  <div class="mobile-drawer" id="drawer">
    ${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}<span>›</span></a>`).join('')}
    <a href="booking.html">立即预约<span>›</span></a>
    <a href="booking-guide.html">预约须知<span>›</span></a>
  </div>`;
}

function renderFooter() {
  return `
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="logo" style="margin-bottom:12px">
            <span class="logo-mark">M</span>
            <span class="logo-text">MAKEUP DATE<small>妆造预约平台</small></span>
          </div>
          <p class="small muted" style="max-width:34ch">连接你与专业化妆师的妆造预约平台。看真实客片、比透明套餐、选合适档期。</p>
          <div class="flex gap6 mt16">
            <span class="tag gold">✓ 实名认证</span>
            <span class="tag">原相机承诺</span>
          </div>
        </div>
        <div>
          <h4>浏览</h4>
          <a href="styles.html">妆造风格</a>
          <a href="artists.html">妆娘列表</a>
          <a href="portfolio.html">作品集</a>
          <a href="location.html">按地区找</a>
        </div>
        <div>
          <h4>预约</h4>
          <a href="booking.html">预约表单</a>
          <a href="booking-guide.html">预约须知</a>
          <a href="budget.html">预算筛选</a>
          <a href="booking-confirmation.html">预约确认</a>
        </div>
        <div>
          <h4>关于</h4>
          <a href="about.html">关于我们</a>
          <a href="reviews.html">客户评价</a>
          <a href="faq.html">常见问题</a>
          <a href="artists.html">筛选妆娘</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2026 MAKEUP DATE 妆造预约平台 · 演示站点</span>
        <span>本网站为课程/作品集演示用途 · 图片来自 Unsplash</span>
      </div>
      <div class="foot-bottom" style="border-top:0;padding-top:0;gap:6px 14px">
        <span class="xs" style="color:var(--muted)">全部页面：</span>
        <a class="xs" href="index.html" style="color:var(--ink-soft)">首页</a>
        <a class="xs" href="about.html" style="color:var(--ink-soft)">关于</a>
        <a class="xs" href="styles.html" style="color:var(--ink-soft)">风格总览</a>
        <a class="xs" href="style-daily.html" style="color:var(--ink-soft)">日常妆</a>
        <a class="xs" href="style-guofeng.html" style="color:var(--ink-soft)">古风妆</a>
        <a class="xs" href="style-cos.html" style="color:var(--ink-soft)">Cosplay 妆</a>
        <a class="xs" href="artists.html" style="color:var(--ink-soft)">妆娘列表</a>
        <a class="xs" href="artist-yuki.html" style="color:var(--ink-soft)">妆娘 A</a>
        <a class="xs" href="artist-mia.html" style="color:var(--ink-soft)">妆娘 B</a>
        <a class="xs" href="portfolio.html" style="color:var(--ink-soft)">作品集</a>
        <a class="xs" href="artists.html" style="color:var(--ink-soft)">筛选妆娘</a>
        <a class="xs" href="location.html" style="color:var(--ink-soft)">地区</a>
        <a class="xs" href="budget.html" style="color:var(--ink-soft)">预算</a>
        <a class="xs" href="booking.html" style="color:var(--ink-soft)">预约表单</a>
        <a class="xs" href="booking-confirmation.html" style="color:var(--ink-soft)">预约确认</a>
        <a class="xs" href="booking-guide.html" style="color:var(--ink-soft)">预约须知</a>
        <a class="xs" href="reviews.html" style="color:var(--ink-soft)">客户评价</a>
        <a class="xs" href="faq.html" style="color:var(--ink-soft)">常见问题</a>
      </div>
    </div>
  </footer>`;
}

/* Sticky mobile action bar */
function renderStickyBar({ price = 'HK$1,280', label = '起 · 新娘全天跟妆', primary = '立即预约', href = 'booking.html' } = {}) {
  return `
  <div class="sticky-bar">
    <div class="price-block">
      <b>${price}</b>
      <small>${label}</small>
    </div>
    <a href="reviews.html#contact" class="btn btn-light btn-icon" style="border-color:var(--line)">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 01-8 8H8l-5 3 1.6-5A8 8 0 1121 12z" stroke-linejoin="round"/></svg>
    </a>
    <a href="${href}" class="btn btn-dark">${primary}</a>
  </div>`;
}

/* Generic look card for masonry */
function lookCard(w, opts = {}) {
  const artist = ARTISTS.find((a) => a.works.includes(w)) || ARTISTS[0];
  const labels = { [P.look_c]: '新娘跟妆', [P.look_h]: '伪素颜', [P.look_i]: '舞台妆', [P.look_b]: '古风妆' };
  const label = labels[w] || opts.label || artist.styles[0];
  const ratio = opts.ratio || [3, 4];
  return `
  <article class="look reveal">
    <div class="look-img">
      ${img(w, { w: 600, h: Math.round((600 / ratio[0]) * ratio[1]), alt: `${artist.name} · ${label}` })}
      <div class="look-badges">
        <span class="tag glass">${label}</span>
        ${opts.badge ? `<span class="tag ${opts.badgeCls || 'gold'}">${opts.badge}</span>` : ''}
      </div>
      <button class="look-fav" aria-label="收藏此作品">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="look-meta">
      <div class="row1">
        ${avatar(artist)}
        <div class="name-wrap">
          <span class="look-name">${artist.name}${artist.verified ? '<span class="verif"> ◆</span>' : ''}</span>
          ${credBadge(artist)}
        </div>
      </div>
      <div class="row2">
        <span class="look-price">HK$${artist.price.toLocaleString()} <small>起</small></span>
        <span>${artist.city.replace('香港 · ', '')} · ★ ${artist.rating}</span>
      </div>
    </div>
  </article>`;
}

/* 有专属主页的化妆师；其余回落到作品集/列表页 */
const ARTIST_PAGES = { yuki: 'artist-yuki.html', mia: 'artist-mia.html' };
function artistHref(a) {
  return (a && ARTIST_PAGES[a.id]) || 'portfolio.html';
}

/* Horizontal list card */
function listCard(a) {
  const href = artistHref(a);
  const why = a._why
    ? `<div class="why-row mt4">${String(a._why)
        .split('|')
        .filter(Boolean)
        .map((w) => `<span class="why-chip">${w}</span>`)
        .join('')}</div>`
    : '';
  return `
  <article class="list-card reveal" data-price="${a.price}" data-rating="${a.rating}">
    <div class="list-left">
      <div class="list-head">
        ${avatar(a).replace('look-avatar', 'list-avatar')}
        <div>
          <h3>${a.name} ${a.verified ? '<span class="tag gold">◆ 认证</span>' : ''}</h3>
          <div class="sub">${a.area}</div>
          <div class="sub mt4"><span class="cred-badge">${a.gender || '女'} · ${a.years}年 · ${(a.styles || []).slice(0, 2).join(' / ')}</span></div>
          <div class="sub mt4"><span class="stars">★★★★★</span> ${a.rating} · ${a.reviews} 条评价</div>
        </div>
      </div>
      ${why}
      <div class="list-stats">
        <div class="stat"><div class="k">从业</div><div class="v">${a.years} 年</div></div>
        <div class="stat"><div class="k">起订价</div><div class="v">HK$${a.price.toLocaleString()}</div></div>
        <div class="stat"><div class="k">档期</div><div class="v" style="font-size:13px">${a.slots}</div></div>
      </div>
      <div class="list-tags">
        ${a.styles.map((s) => `<span class="tag">${s}</span>`).join('')}
      </div>
      <div class="flex gap10 mt4" style="flex-wrap:wrap">
        <a href="${href}" class="btn btn-dark btn-sm">查看主页</a>
        <a href="booking.html" class="btn btn-light btn-sm">预约档期</a>
        <span class="tag outline">${a.home}</span>
      </div>
    </div>
    <div class="list-gallery-rich">
      ${a.works
        .slice(0, 4)
        .map((w, i) => `<a class="gal-item" href="portfolio.html">
            ${i === 0 ? `<span class="gal-badge">代表作</span>` : ''}
            ${img(w, { w: 400, h: 520, alt: `${a.name} 作品 ${i + 1}` })}
            <div class="gal-cap">
              <span class="g-t">${(a.workCaptions && a.workCaptions[i] && a.workCaptions[i].t) || a.styles[i % a.styles.length]}</span>
              <span class="g-s">${(a.workCaptions && a.workCaptions[i] && a.workCaptions[i].s) || ''}</span>
            </div>
          </a>`)
        .join('')}
    </div>
  </article>`;
}

function mountChrome(active) {
  const navHost = document.getElementById('site-nav');
  const footHost = document.getElementById('site-footer');
  if (navHost) navHost.innerHTML = renderNav(active);
  if (footHost) footHost.innerHTML = renderFooter();
  const stickyHost = document.getElementById('site-sticky');
  if (stickyHost && stickyHost.dataset.enable !== 'false') {
    stickyHost.innerHTML = renderStickyBar({
      price: stickyHost.dataset.price || 'HK$1,280',
      label: stickyHost.dataset.label || '起 · 新娘全天跟妆',
      primary: stickyHost.dataset.primary || '立即预约',
      href: stickyHost.dataset.href || 'booking.html',
    });
  }
  // wire burger (nav is injected after app.js may have run)
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => drawer.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !burger.contains(e.target)) drawer.classList.remove('open');
    });
  }
}
