/* ============================================================
   MAKEUP DATE · hydrate placeholders marked with data-*
   Runs after layout.js + data.js + photos.js
   ============================================================ */

// Scripts are loaded at the end of <body>, so the DOM may already be parsed.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function boot() {
  mountChrome();
  hydrate();
  // 所有动态内容（导航 / 页脚 / 卡片流 / 场景区）渲染完成后，
  // 通知 i18n 重新走一遍；i18n.js 若尚未加载则忽略，init() 会自己 apply
  document.dispatchEvent(new CustomEvent('md:rerender'));
}

function hydrate() {
  /* ---- 全部推荐：横向卡片流 ---- */
  const gallery = document.getElementById('masonry');
  if (gallery) {
    const all = [];
    ARTISTS.forEach((a) =>
      a.works.forEach((w, i) =>
        all.push({
          id: w,
          artist: a.id,
          // 每张作品带自己的风格标记（data.js 的 workStyles），
          // 这样筛选结果与图片内容、标签文字三者严格一致
          style: (a.workStyles && a.workStyles[i]) || styleKeyOf(a, i),
          label: STYLE_TABS.find(
            (t) => t.key === ((a.workStyles && a.workStyles[i]) || styleKeyOf(a, i))
          )?.name || a.styles[0],
          h: [1.1, 1.42, 1.25, 1.55, 1.18, 1.36][(all.length + i) % 6],
        })
      )
    );

    /* ------------------------------------------------------------
       「全部推荐」每个风格只展示一张，但必须用「图片内容真的属于该风格」的图。
       按化妆师 styles 标签自动挑选会出错（例如 Yuki 有「日常约会」标签，
       但她的作品全是婚礼浓妆），因此这里用人工核对过的显式映射：
       每条 = [图片 key, 风格 key, 所属化妆师 id]
       注意：img() 接收的是 Unsplash 图片 ID，所以这里用 P[key] 取真实 ID。
       ------------------------------------------------------------ */
    const FEATURED = [
      ['look_99', 'daily', 'mia'],      // 日常约会：清透淡妆近景
      ['look_35', 'photo', 'rui'],      // 写真旅拍：绿植背景近景妆面
      ['look_17', 'stage', 'yuki'],     // 舞台年会：强光浓妆特写
      ['look_74', 'bridal', 'yuki'],    // 新娘跟妆：仪式白纱
      ['look_115', 'cos', 'sora'],      // 漫展 Cos：水手服角色
      ['look_80', 'men', 'ken'],        // 男士修容：商务出行
      ['look_45', 'guofeng', 'gu'],     // 古风妆：红金花钿
    ];

    const ordered = FEATURED.map(([key, style, artist]) => ({
      id: P[key],
      key,
      style,
      artist,
      label: STYLE_TABS.find((t) => t.key === style)?.name || '',
    }));

    gallery.innerHTML = ordered
      .map((it) => {
        const a = ARTISTS.find((z) => z.id === it.artist);
        return `
          <article class="rail-card" data-style="${it.style}">
            <a class="rail-link" href="${artistHref(a)}">
              <div class="rail-img">
                ${img(it.id, { w: 400, h: 520, alt: `${a.name} · ${it.label}` })}
                <span class="rail-tag">${it.label}</span>
              </div>
              <div class="rail-meta">
                <div class="rail-row1">
                  ${avatar(a)}
                  <span class="rail-name">${a.name}${a.verified ? '<span class="verif"> ◆</span>' : ''}</span>
                  <span class="rail-star">★ ${a.rating}</span>
                </div>
                <div class="rail-row-skill">${a.gender || '女'} · ${a.years}年 · ${(a.styles || []).slice(0, 2).join(' / ')}</div>
                <div class="rail-row2">
                  <span class="rail-price">HK$${a.price.toLocaleString()} <small>起</small></span>
                  <span class="rail-area">${a.city.replace('香港 · ', '')}</span>
                </div>
              </div>
            </a>
          </article>`;
      })
      .join('');
  }

  bindRail();

  /* ---- artist list mode ---- */
  const listHost = document.getElementById('artist-list');
  if (listHost) {
    // 若页面自带多维筛选（#filterRail），交由页面脚本渲染，避免重复注入
    const hasOwnFilter = !!document.getElementById('filterRail');
    const isSearchPage = !!document.querySelector('.sug-chips, [data-sort-bar]');
    if (hasOwnFilter) {
      // artists.html 自行管理渲染
    } else if (isSearchPage) {
      initSearchPage(listHost);
    } else {
      listHost.innerHTML = ARTISTS.map(listCard).join('');
    }
  }

  /* ---- related artists scroller ---- */
  const relHost = document.getElementById('related');
  if (relHost) {
    relHost.innerHTML = ARTISTS.slice(0, 6)
      .map(
        (a) => `<a href="artist-yuki.html" class="look" style="display:block">
          <div class="look-img">${img(a.cover, { w: 500, h: 620, alt: a.name })}</div>
          <div class="look-meta">
            <div class="row1"><span class="look-name">${a.name}${a.verified ? '<span class="verif"> ◆</span>' : ''}</span></div>
            <div class="row2"><span class="look-price">HK$${a.price.toLocaleString()} 起</span><span>★ ${a.rating}</span></div>
          </div>
        </a>`
      )
      .join('');
  }

  /* ---- stat counters ---- */
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const to = +el.dataset.countTo;
    const suffix = el.dataset.suffix || '';
    el.textContent = to.toLocaleString() + suffix;
  });

  /* ---- results count ---- */
  document.querySelectorAll('[data-result-count]').forEach((el) => {
    el.textContent = document.querySelectorAll('[data-price]').length;
  });

  reobserve();
}

function reobserve() {
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io2.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io2.observe(el));
}

function styleKeyOf(a, i) {
  // 优先用该作品自己的真实风格，避免「写真/旅拍」标签贴到新娘图上
  const own = (a.workStyles || [])[i];
  if (own) return own;
  const s = a.styles[i % a.styles.length];
  if (s.includes('新娘')) return 'bridal';
  if (s.includes('日常')) return 'daily';
  if (s.includes('写真')) return 'photo';
  if (s.includes('Cos') || s.includes('漫展')) return 'cos';
  if (s.includes('舞台')) return 'stage';
  if (s.includes('男士')) return 'men';
  if (s.includes('古风')) return 'guofeng';
  return 'all';
}

/* 作品风格 key -> 场景名，与 data.js 的 styles 命名保持一致 */
const WORK_STYLE_NAME = {
  bridal: '新娘跟妆',
  daily: '日常约会',
  photo: '写真/旅拍',
  cos: '漫展/Cosplay',
  stage: '舞台/年会',
  guofeng: '古风妆',
  men: '男士修容',
};

/* 该化妆师作品里真实出现过的场景名集合 */
function realScenesOf(a) {
  const set = new Set();
  (a.works || []).forEach((w, i) => {
    const k = (a.workStyles || [])[i];
    if (k && WORK_STYLE_NAME[k]) set.add(WORK_STYLE_NAME[k]);
  });
  return [...set];
}

/* ============================================================
   搜索页：关键词匹配 + 综合/评分/价格排序
   ============================================================ */

/* 关键词 -> 匹配规则。一个关键词命中越多字段，匹配度越高 */
const SEARCH_RULES = [
  // 新娘
  { kw: ['新娘', '跟妆', '婚礼', '大日子', '出门', '敬酒'], styles: ['新娘跟妆'], tags: ['全程跟妆', '含免费试妆', '妈妈妆', '全天'] },
  // 日常 / 伪素颜
  { kw: ['伪素颜', '素颜', '日常', '约会', '通勤', '淡妆', '裸妆'], styles: ['日常约会'], tags: ['伪素颜', '清透水光', '裸妆', '自然淡妆', '提气色'] },
  // 写真 / 旅拍
  { kw: ['写真', '旅拍', '拍照', '相片', '摄影'], styles: ['写真/旅拍'], tags: ['旅拍', '旅拍跟妆', '国风摄影'] },
  // 漫展 / Cos
  { kw: ['漫展', 'cos', 'Cos', 'COS', '角色', '假发', '二次元'], styles: ['漫展/Cosplay'], tags: ['毛娘', '特效', '贴钻'] },
  // 舞台 / 年会
  { kw: ['舞台', '年会', '演出', '表演', '宴会', '主持'], styles: ['舞台/年会'], tags: ['舞台', '年会', '饰品'] },
  // 古风
  { kw: ['古风', '汉服', '国风', '花钿', '旗袍'], styles: ['古风妆'], tags: ['汉服', '发饰', '国风'] },
  // 男士
  { kw: ['男士', '男妆', '修容', '商务', '明星形象', '男'], styles: ['男士修容', '商务形象'], tags: ['男士', '商务', '隐形修眉', '无油光'] },
  // 服务方式
  { kw: ['上门'], tags: ['上门'], areas: true },
  { kw: ['到店'], tags: ['到店'] },
  { kw: ['今日可约', '今天', '即时', '快'], slots: true },
];

/* 把 / 与 · 统一成分隔，便于分词 */
function normText(s) {
  return String(s || '').replace(/[\/·、,，]/g, ' ').toLowerCase();
}

/* 计算单个化妆师与关键词的匹配分 */
function matchScore(a, rawQuery) {
  const q = normText(rawQuery).trim();
  if (!q) return { score: 0, hits: [] };

  const tokens = q.split(/\s+/).filter(Boolean);
  const fields = {
    name: normText(a.name),
    en: normText(a.en),
    area: normText(a.area),
    city: normText(a.city),
    styles: normText((a.styles || []).join(' ')),
    tags: normText((a.tags || []).join(' ')),
    bio: normText(a.bio),
    home: normText(a.home),
    slots: normText(a.slots),
  };
  const blob = Object.values(fields).join(' ');

  let score = 0;
  const hits = [];

  tokens.forEach((tk) => {
    // 1) 直接命中任意文本字段
    if (blob.includes(tk)) {
      score += 4;
      hits.push(tk);
    }
    // 2) 命中规则表
    SEARCH_RULES.forEach((rule) => {
      if (!rule.kw.some((k) => normText(k).includes(tk) || tk.includes(normText(k)))) return;
      let bonus = 0;
      (rule.styles || []).forEach((s) => {
        if ((a.styles || []).some((x) => normText(x).includes(normText(s)))) bonus += 6;
      });
      (rule.tags || []).forEach((t) => {
        if ((a.tags || []).some((x) => normText(x).includes(normText(t)))) bonus += 3;
      });
      if (rule.areas && fields.home.includes('上门')) bonus += 2;
      if (rule.slots && (a.slots || '').includes('今日')) bonus += 5;
      score += bonus;
    });
  });

  return { score, hits: [...new Set(hits)] };
}

/* 判断某位化妆师是否真的匹配某个关键词（用于过滤，比 matchScore 更严格） */
function isRelevant(a, rawQuery) {
  const q = normText(rawQuery).trim();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);

  const fields = {
    name: normText(a.name),
    en: normText(a.en),
    area: normText(a.area),
    styles: normText((a.styles || []).join(' ')),
    tags: normText((a.tags || []).join(' ')),
    home: normText(a.home),
    slots: normText(a.slots),
  };

  return tokens.some((tk) => {
    // 专有服务词：上门 / 到店 / 今日可约
    if (tk === '上门') return fields.home.includes('上门');
    if (tk === '到店') return fields.tags.includes('到店') || fields.home.includes('到店');
    if (tk.includes('今日') || tk.includes('今天') || tk.includes('即时'))
      return fields.slots.includes('今日');

    // 「跟妆」不作单独匹配依据，必须与风格名组合（如「新娘跟妆」）
    if (tk === '跟妆') {
      return fields.styles.includes('新娘跟妆');
    }

    // 常规：命中风格 / 标签 / 名字 / 地区
    // 风格类命中必须「作品里真的有这类作品」，否则标签与客片对不上
    const ruleHit = SEARCH_RULES.find(
      (rule) =>
        rule.kw.some((k) => normText(k).includes(tk) || tk.includes(normText(k))) &&
        (rule.styles || []).length
    );
    if (ruleHit) {
      const real = realScenesOf(a);
      return (ruleHit.styles || []).some((s) => real.includes(s));
    }

    if (fields.styles.includes(tk)) return true;
    if (fields.tags.includes(tk)) return true;
    if (fields.name.includes(tk) || fields.en.includes(tk)) return true;
    if (fields.area.includes(tk)) return true;

    // 走规则表兜底
    return SEARCH_RULES.some(
      (rule) =>
        rule.kw.some((k) => normText(k).includes(tk) || tk.includes(normText(k))) &&
        ((rule.styles || []).some((s) => fields.styles.includes(normText(s))) ||
          (rule.tags || []).some((t) => fields.tags.includes(normText(t))))
    );
  });
}

/* 排序策略 */
const SORTS = {
  relevance: (list, q) =>
    list
      .map((a) => ({ a, s: matchScore(a, q).score }))
      .sort((x, y) => y.s - x.s || y.a.rating - x.a.rating)
      .map((x) => x.a),
  rating: (list) => [...list].sort((x, y) => y.rating - x.rating),
  ratingAsc: (list) => [...list].sort((x, y) => x.rating - y.rating),
  priceAsc: (list) => [...list].sort((x, y) => x.price - y.price),
  priceDesc: (list) => [...list].sort((x, y) => y.price - x.price),
};

function initSearchPage(host) {
  const params = new URLSearchParams(location.search);
  const input = document.querySelector('.search-deck input[name="q"]');
  const chipHost = document.querySelector('.sug-chips');
  const sortBtns = [...document.querySelectorAll('.toolbar .chip')].filter((b) =>
    /综合推荐|评分最高|评分最低|价格最低|价格最高/.test(b.textContent)
  );
  const headH1 = document.querySelector('.result-head h1');
  const countEl = document.querySelector('[data-result-count]');
  const emptyEl = document.querySelector('.empty-state');

  // 关键词：URL 有 q 参数时以 URL 为准（允许为空 = 显示全部）
  const qParam = params.get('q');
  let query = qParam !== null ? qParam : (input ? input.value : '') || '';
  // 「全部」= 不限关键词
  if (query.trim() === '全部') query = '';
  let sort = params.get('sort') || 'relevance';

  // 附加筛选：地区 / 预算 / 服务方式 / 今日可约
  const fDistrict = (params.get('district') || '').split(',').filter(Boolean);
  const fScene = (params.get('scene') || '').split(',').filter(Boolean);
  const fService = (params.get('service') || '').split(',').filter(Boolean);
  const fToday = params.get('today') === '1';
  const fMax = +params.get('max') || 0;
  const fPrice = params.get('price') || '';
  let fPriceRange = null;
  if (fPrice.includes('-')) {
    const [lo, hi] = fPrice.split('-').map(Number);
    fPriceRange = [lo, hi];
  }

  function matchesFilters(a) {
    if (fDistrict.length) {
      const ds = (a.area || '').split('/').map((s) => s.trim());
      if (!fDistrict.some((d) => ds.includes(d))) return false;
    }
    if (fScene.length) {
      const real = realScenesOf(a);
      if (!fScene.some((s) => real.includes(s))) return false;
    }
    if (fService.length) {
      const home = /上门/.test(a.home || '');
      const shop = /到店/.test((a.tags || []).join('') + (a.home || ''));
      if (!fService.some((s) => (s === '上门' ? home : shop))) return false;
    }
    if (fToday && !/今日/.test(a.slots || '')) return false;
    if (fPriceRange && (a.price < fPriceRange[0] || a.price > fPriceRange[1])) return false;
    if (fMax && a.price > fMax) return false;
    return true;
  }

  if (input) input.value = query;

  // 热门标签：带上真实关键词跳转
  if (chipHost) {
    const kws = ['新娘跟妆', '伪素颜', '漫展 Cos', '古风妆', '今日可约', '上门'];
    chipHost.innerHTML =
      '<span class="xs muted" style="align-self:center">热门搜索：</span>' +
      kws
        .map(
          (k) =>
            `<a href="search.html?q=${encodeURIComponent(k)}" class="chip tiny" data-kw="${k}">${k}</a>`
        )
        .join('');
  }

  // 排序按钮：确保存在「评分最高 / 价格最低」，并绑定事件
  const toolbar = document.querySelector('.toolbar');
  if (toolbar) {
    const wanted = [
      { label: '综合推荐', key: 'relevance' },
      { label: '评分最高', key: 'rating' },
      { label: '价格最低', key: 'priceAsc' },
    ];
    // 移除原有的三个排序按钮，重建
    sortBtns.forEach((b) => b.remove());
    const spacer = toolbar.querySelector('[style*="margin-left"]');
    if (spacer) spacer.style.marginLeft = 'auto';
    wanted.forEach(({ label, key }) => {
      const b = document.createElement('button');
      b.className = 'chip tiny' + (key === sort ? ' active' : '');
      b.textContent = label;
      b.dataset.sortKey = key;
      b.addEventListener('click', () => {
        sort = key;
        [...toolbar.querySelectorAll('[data-sort-key]')].forEach((x) =>
          x.classList.toggle('active', x.dataset.sortKey === key)
        );
        render();
      });
      toolbar.appendChild(b);
    });
  }

  function render() {
    // 1) 过滤：严格判定是否真的相关
    let list = query.trim() ? ARTISTS.filter((a) => isRelevant(a, query)) : ARTISTS.slice();
    // 1.5) 附加筛选条件（地区 / 场景 / 服务方式 / 预算）
    list = list.filter(matchesFilters);

    // 2) 排序
    const sorter = SORTS[sort] || SORTS.relevance;
    const sorted = sorter(list, query);

    // 2.5) 给每张卡片算「为什么匹配」徽章
    const reason = (a) => {
      const out = [];
      const q = normText(query);
      if (!q.trim()) return '';
      const tokens = q.split(/\s+/).filter(Boolean);

      /* 只保留与关键词「真正相关」的字段：
         1) 风格名完全或包含命中
         2) 标签命中，但排除「跟妆」这类过于宽泛的通用词单独命中 */
      const GENERIC = ['跟妆', '化妆', '服务', '可选', '加购', '支持'];
      const meaningful = (tk) => tk.length >= 2 && !GENERIC.includes(tk);

      // 服务类关键词：上门 / 到店 / 今日可约
      tokens.forEach((tk) => {
        if (tk === '上门' && (a.home || '').includes('上门')) out.push('提供上门');
        if (tk === '到店' && ((a.tags || []).includes('到店可选') || (a.home || '').includes('到店')))
          out.push('支持到店');
        if ((tk.includes('今日') || tk.includes('今天') || tk.includes('即时')) &&
            (a.slots || '').includes('今日'))
          out.push(a.slots);
      });

      (a.styles || []).forEach((s) => {
        if (tokens.some((t) => normText(s).includes(t))) out.push(`擅长 ${s}`);
      });
      (a.tags || []).forEach((t) => {
        if (tokens.some((x) => normText(t).includes(x))) {
          const onlyGeneric = tokens
            .filter((x) => normText(t).includes(x))
            .every((x) => GENERIC.includes(x));
          if (!onlyGeneric) out.push(t);
        }
      });

      // 没有任何有效理由时，用风格兜底（避免空白）
      if (out.length === 0) {
        const m = matchScore(a, query);
        if (m.score > 0) {
          const r = SEARCH_RULES.find((rule) => rule.kw.some((k) => q.includes(normText(k))));
          if (r && r.styles) {
            r.styles.forEach((s) => {
              if ((a.styles || []).some((x) => normText(x).includes(normText(s))))
                out.push(`擅长 ${s}`);
            });
          }
        }
      }
      return [...new Set(out)].slice(0, 3).join('|');
    };

    // 3) 渲染
    host.innerHTML = sorted
      .map((a) => {
        const why = reason(a);
        return listCard({ ...a, _why: why });
      })
      .join('');
    if (countEl) countEl.textContent = sorted.length;

    // 4) 标题
    if (headH1) {
      headH1.innerHTML = query.trim()
        ? `「<span class="kw">${query}</span>」的搜索结果`
        : `全部化妆师 <span class="kw">${sorted.length}</span> 位`;
    }

    // 5) 空状态
    if (emptyEl) {
      emptyEl.style.display = sorted.length ? 'none' : 'block';
      emptyEl.style.marginTop = sorted.length ? '0' : '32px';
    }

    // 6) 排序说明
    const hint = document.querySelector('.result-head .small.muted');
    if (hint) {
      const label =
        sort === 'rating'
          ? '评分从高到低'
          : sort === 'ratingAsc'
          ? '评分从低到高'
          : sort === 'priceAsc'
          ? '价格从低到高'
          : sort === 'priceDesc'
          ? '价格从高到低'
          : '已按匹配度排序';
      hint.innerHTML = `共 <b class="bold" data-result-count>${sorted.length}</b> 位化妆师符合条件 · ${label}`;
    }

    // 7) 同步 URL（不刷新页面）
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (sort !== 'relevance') p.set('sort', sort);
    // 保留来自上一页的附加筛选，别被清掉
    if (fDistrict.length) p.set('district', fDistrict.join(','));
    if (fScene.length) p.set('scene', fScene.join(','));
    if (fService.length) p.set('service', fService.join(','));
    if (fToday) p.set('today', '1');
    if (fPrice) p.set('price', fPrice);
    if (fMax) p.set('max', fMax);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));

    // 8) 重新做入场动画
    if (typeof reobserve === 'function') reobserve();
  }

  // 表单提交
  const form = document.querySelector('.search-deck');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input ? input.value.trim() : '';
      query = val;
      const mini = document.querySelector('.search-mobile-mini strong');
      if (mini) mini.textContent = val || '全部化妆师';
      render();
    });
  }

  // 输入框回车/防抖
  if (input) {
    input.addEventListener('input', () => {
      query = input.value;
      render();
    });
  }

  // 热门标签点击：就地过滤，不跳页
  if (chipHost) {
    chipHost.addEventListener('click', (e) => {
      const a = e.target.closest('[data-kw]');
      if (!a) return;
      e.preventDefault();
      query = a.dataset.kw;
      if (input) input.value = query;
      const mini = document.querySelector('.search-mobile-mini strong');
      if (mini) mini.textContent = query;
      render();
      document.querySelector('.result-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();
}

function filterMasonry(key) {
  document.querySelectorAll('#masonry [data-style]').forEach((el) => {
    el.style.display = key === 'all' || el.dataset.style === key ? '' : 'none';
  });
  const empty = document.getElementById('masonry-empty');
  if (empty) {
    const shown = [...document.querySelectorAll('#masonry [data-style]')].some(
      (e) => e.style.display !== 'none'
    );
    empty.style.display = shown ? 'none' : 'block';
  }
}

/* ============================================================
   细分风格区：按场景展示每一类的具体样式
   ============================================================ */
function hydrateSubStyles() {
  const host = document.getElementById('sub-styles');
  if (!host) return;
  const groups = (typeof SUB_STYLES !== 'undefined' && SUB_STYLES) || window.SUB_STYLES;
  if (!groups || !groups.length) return;

  host.innerHTML = groups.map((g) => `
    <section class="sub-group" id="sub-${g.key}">
      <div class="sub-head">
        <div>
          <h3 class="sub-title">${g.name}</h3>
          ${g.desc ? `<p class="sub-desc">${g.desc}</p>` : ''}
        </div>
        <span class="sub-count">${g.items.length} 种场景</span>
      </div>
      <div class="sub-grid">
        ${g.items
          .map(
            (it) => `
          <a class="sub-card" href="artists.html">
            <div class="sub-img">
              ${photoTag(it.img, 400, 520, it.t)}
              <span class="sub-tag">${it.t}</span>
            </div>
            <p class="sub-note">${it.s}</p>
          </a>`
          )
          .join('')}
      </div>
    </section>`).join('');

  // 顶部快捷跳转
  const nav = document.getElementById('sub-nav');
  if (nav) {
    nav.innerHTML = groups.map(
      (g) => `<a class="chip tiny" href="#sub-${g.key}">${g.name}</a>`
    ).join('');
  }
}

/* 生成单个 img 标签的辅助函数 */
function photoTag(id, w, h, alt) {
  return `<img src="${photo(id, w, h)}" alt="${String(alt || '').replace(/"/g, '&quot;')}" width="${w}" height="${h}" loading="lazy">`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateSubStyles);
} else {
  hydrateSubStyles();
}

/* 横向卡片流：左右按钮 + 键盘
------------------------------------ */
function bindRail() {
  const rail = document.getElementById('masonry');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!rail) return;

  const step = () => {
    const card = rail.querySelector('.rail-card');
    if (!card) return 320;
    const gap = 16;
    return card.getBoundingClientRect().width + gap;
  };

  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 4;
    if (prev) prev.disabled = rail.scrollLeft <= 4;
    if (next) next.disabled = rail.scrollLeft >= max;
  };

  if (prev) prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  rail.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  setTimeout(update, 300);
}
