/* ============================================================
   MAKEUP DATE · shared app logic
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- Mobile drawer ---------- */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => drawer.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !burger.contains(e.target)) drawer.classList.remove('open');
  });
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
$$('.reveal').forEach((el) => io.observe(el));

/* ---------- Chips (single select groups) ---------- */
$$('[data-chip-group]').forEach((group) => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    group.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const ev = new CustomEvent('chipchange', { detail: { value: chip.dataset.value }, bubbles: true });
    group.dispatchEvent(ev);
  });
});

/* ---------- Tabs ---------- */
$$('[data-tabs]').forEach((tabs) => {
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    tabs.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
    const target = btn.dataset.target;
    if (target) {
      const scope = tabs.dataset.tabs;
      $$(`[data-pane]${scope ? `[data-scope="${scope}"]` : ''}`).forEach((p) => {
        p.style.display = p.dataset.pane === target ? '' : 'none';
      });
    }
  });
});

/* ---------- Fav hearts ---------- */
document.addEventListener('click', (e) => {
  const fav = e.target.closest('.look-fav, .fav-btn');
  if (!fav) return;
  e.preventDefault();
  e.stopPropagation();
  fav.classList.toggle('on');
  const filled = fav.classList.contains('on');
  const svg = fav.querySelector('svg');
  if (svg) svg.setAttribute('fill', filled ? 'currentColor' : 'none');
  if (filled) {
    fav.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }],
      { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }
    );
  }
});

/* ---------- FAQ accordion ---------- */
$$('.faq-q').forEach((q) => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const ans = item.querySelector('.faq-a');
    const open = item.classList.contains('open');
    // close siblings within same list (optional accordion behaviour)
    const list = item.parentElement;
    if (list && list.dataset.multi !== 'true') {
      $$('.faq-item', list).forEach((sib) => {
        if (sib !== item) {
          sib.classList.remove('open');
          const a = sib.querySelector('.faq-a');
          if (a) a.style.maxHeight = '0px';
        }
      });
    }
    item.classList.toggle('open', !open);
    ans.style.maxHeight = open ? '0px' : ans.scrollHeight + 'px';
  });
});

/* ---------- Calendar builder ---------- */
function buildCalendar(host, opts = {}) {
  if (!host) return;
  const month = opts.month ?? 10; // 0-index, 10 = Nov
  const year = opts.year ?? 2026;
  const selected = opts.selected ?? 14;
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const today = 17;
  const fewDays = [21, 22, 29];
  const fullDays = [18, 19, 25, 26, 30];

  let html = '';
  for (let i = 0; i < startDow; i++) html += '<div class="cal-day empty"></div>';
  for (let d = 1; d <= days; d++) {
    let cls = 'cal-day ok';
    if (d < today) cls = 'cal-day full';
    else if (fullDays.includes(d)) cls = 'cal-day full';
    else if (fewDays.includes(d)) cls = 'cal-day few';
    if (d === selected) cls += ' sel';
    html += `<button class="${cls}" data-day="${d}">${d}${cls.includes('few') ? '<span class="dot"></span>' : ''}</button>`;
  }
  host.innerHTML = html;

  host.addEventListener('click', (e) => {
    const b = e.target.closest('.cal-day');
    if (!b || b.classList.contains('full') || b.classList.contains('empty')) return;
    host.querySelectorAll('.cal-day').forEach((x) => x.classList.remove('sel'));
    b.classList.add('sel');
    host.dispatchEvent(new CustomEvent('dayselect', { detail: { day: +b.dataset.day }, bubbles: true }));
  });
}
$$('[data-calendar]').forEach((c) => buildCalendar(c, { month: +(c.dataset.month ?? 10) }));

/* ---------- Simple masonry sizing (keeps images from jumping) ---------- */
$$('.look-img img').forEach((img) => {
  if (!img.alt) img.alt = '妆容作品客片';
});

/* ---------- Booking form behaviour ---------- */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const recalc = () => {
    const pack = $('.opt.on[data-price]');
    const base = pack ? +pack.dataset.price : 0;
    const home = $('.opt.on[data-home="1"]');
    const homeFee = home ? 60 : 0;
    const total = base + homeFee;
    const el = (id) => document.getElementById(id);
    if (el('sumPackage')) el('sumPackage').textContent = pack ? pack.dataset.name : '未选择';
    if (el('sumBase')) el('sumBase').textContent = base ? `HK$${base}` : '—';
    if (el('sumFee')) el('sumFee').textContent = homeFee ? `HK$${homeFee}` : '免费';
    if (el('sumTotal')) el('sumTotal').textContent = total ? `HK$${total}` : '—';
  };
  $$('#bookingForm .opt-group').forEach((g) => {
    g.addEventListener('click', (e) => {
      const o = e.target.closest('.opt');
      if (!o) return;
      g.querySelectorAll('.opt').forEach((x) => x.classList.remove('on'));
      o.classList.add('on');
      recalc();
    });
  });
  $$('#bookingForm input[type=checkbox]').forEach((c) => c.addEventListener('change', recalc));
  recalc();

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dt = new FormData(bookingForm);
    const params = new URLSearchParams();
    ['name', 'phone', 'artist', 'date', 'style'].forEach((k) => {
      const v = dt.get(k);
      if (v) params.set(k, v);
    });
    const pack = $('.opt.on[data-name]');
    if (pack) params.set('package', pack.dataset.name);
    window.location.href = 'booking-confirmation.html?' + params.toString();
  });
}

/* ---------- Confirmation page: hydrate from query ---------- */
const confirmList = document.getElementById('confirmList');
if (confirmList) {
  const p = new URLSearchParams(location.search);
  const map = {
    name: '预约人',
    phone: '联系电话',
    artist: '指定化妆师',
    date: '预约日期',
    style: '妆容风格',
    package: '服务套餐',
    mode: '服务方式',
  };
  const defaults = {
    name: '陈小姐', phone: '+852 9*** 2188', artist: 'Yuki Lam',
    date: '2026-11-14 · 09:00', style: '新娘跟妆', package: '新娘全天跟妆', mode: '到店 · 中环工作室',
  };
  let html = '';
  Object.entries(map).forEach(([k, label]) => {
    html += `<div class="srow"><span class="muted">${label}</span><b>${(p.get(k) || defaults[k])}</b></div>`;
  });
  confirmList.innerHTML = html;
}

/* ---------- Map pin selection ---------- */
$$('.map-pin').forEach((pin) => {
  pin.addEventListener('click', () => {
    $$('.map-pin').forEach((p) => p.classList.remove('sel'));
    pin.classList.add('sel');
  });
});

/* ---------- Budget / area filter demo ---------- */
$$('[data-filter-demo]').forEach((scope) => {
  const apply = scope.querySelector('[data-apply]');
  const clear = scope.querySelector('[data-clear]');
  const target = document.querySelector(scope.dataset.filterDemo);
  if (!target) return;
  apply && apply.addEventListener('click', () => {
    const cards = $$('[data-price]', target);
    const min = +(scope.dataset.min || 0) || 0;
    cards.forEach((c) => {
      const v = +c.dataset.price;
      c.style.display = v >= min ? '' : 'none';
    });
    const cnt = document.querySelector('[data-count]');
    if (cnt) cnt.textContent = cards.filter((c) => c.style.display !== 'none').length;
  });
  clear && clear.addEventListener('click', () => {
    $$('[data-price]', target).forEach((c) => (c.style.display = ''));
    const cnt = document.querySelector('[data-count]');
    if (cnt) cnt.textContent = $$('[data-price]', target).length;
  });
});

/* ---------- Sticky bar shadow on scroll ---------- */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  $$('.is-stuck').forEach((el) => el.classList.toggle('stuck', y > 40));
}, { passive: true });
