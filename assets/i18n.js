/* ============================================================
   i18n 核心：语言切换 / 存储 / 应用
   语言：zh-Hant（繁中，默认）· zh-Hans（简中）· en（English）
   源文件全部为简体；繁中按字表实时转换，英文查词条表。
   ============================================================ */
(function () {
  'use strict';

  const LANGS = [
    { code: 'zh-Hant', label: '繁', title: '繁體中文' },
    { code: 'zh-Hans', label: '简', title: '简体中文' },
    { code: 'en', label: 'EN', title: 'English' },
  ];
  const DEFAULT_LANG = 'zh-Hant';
  const STORAGE_KEY = 'md-lang';

  function currentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  /* 查词条：完整匹配 → 去首尾标点 → 分段全词命中 → 兜底原文 */
  function lookup(str) {
    if (typeof EN === 'undefined') return null;
    if (EN[str] != null) return EN[str];

    const core = str.replace(/^[\s·、，。:：!?！？()（）「」『』]+|[\s·、，。:：!?！？()（）「」『』]+$/g, '');
    if (core !== str && EN[core] != null) return EN[core];

    // 分段：按分隔符切开，每段必须整段命中词条，否则放弃整句翻译
    // 这样可以避免「把 Today Hand over 对的人 Draw」这类中英混杂
    const parts = core.split(/(\s*[·、，。:：!?！？()（）「」『』\/]\s*|\s+)/);
    if (parts.length > 1) {
      let allHit = true;
      let hasHit = false;
      const out = parts.map((p) => {
        if (!p || !/[\u4e00-\u9fff]/.test(p)) return p;
        const hit = EN[p];
        if (hit == null) { allHit = false; return p; }
        hasHit = true;
        return hit;
      });
      if (allHit && hasHit) return out.join('');
    }
    return null;
  }

  /* 转换单个字符串 */
  function translateString(str, lang) {
    if (typeof str !== 'string' || !str) return str;
    if (lang === 'zh-Hant') {
      return typeof toTraditional === 'function' ? toTraditional(str) : str;
    }
    if (lang === 'zh-Hans') {
      return typeof toSimplified === 'function' ? toSimplified(str) : str;
    }
    // en
    const hit = lookup(str);
    if (hit != null) return hit;
    // 没有完整词条时：如果词条表里落地的结果仍残留很多中文，
    // 说明只是零散替换，会产生中英混杂 —— 宁可保留原文
    if (typeof EN !== 'undefined') {
      // 单字/双字词也查一下（如「女」「男」）
      if (EN[str] != null) return EN[str];
    }
    return str;
  }

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);

  /* 遍历 DOM 文本节点做替换，并记录原文以便切回 */
  function applyToDom(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // 曾经处理过的节点（有 __mdSrc）必须继续处理，
        // 否则切到英文后再切回中文时，英文文本里没有中文会被跳过，永远恢复不了
        if (node.__mdSrc == null) {
          if (!node.nodeValue || !/[\u4e00-\u9fff]/.test(node.nodeValue)) {
            return NodeFilter.FILTER_REJECT;
          }
        }
        let p = node.parentNode;
        while (p && p !== root) {
          if (p.nodeType === 1 && SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.nodeType === 1 && p.hasAttribute('data-i18n-skip')) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach((node) => {
      // 首次处理时把简体原文存起来
      if (node.__mdSrc == null) node.__mdSrc = node.nodeValue;
      const src = node.__mdSrc;
      const lead = (src.match(/^[\s\u00a0]*/) || [''])[0];
      const trail = (src.match(/[\s\u00a0]*$/) || [''])[0];
      const mid = src.slice(lead.length, src.length - trail.length);
      if (!mid) return;
      node.nodeValue = lead + translateString(mid, lang) + trail;
    });

    // 属性：placeholder / title / aria-label / alt
    const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
    const all = root.querySelectorAll('*');
    all.forEach((el) => {
      ATTRS.forEach((attr) => {
        const key = '__mdAttr_' + attr;
        const val = el.getAttribute(attr);
        // 与文本节点同理：已记录原文的属性必须继续处理
        if (el[key] == null) {
          if (!val || !/[\u4e00-\u9fff]/.test(val)) return;
          el[key] = val;
        }
        el.setAttribute(attr, translateString(el[key], lang));
      });
    });
  }

  /* 数据对象翻译（用于 JS 渲染前）*/
  const DATA_FIELDS = ['name', 'city', 'area', 'home', 'slots', 'bio'];
  const ARRAY_FIELDS = ['styles', 'tags'];

  function translateArtist(a, lang) {
    if (!a || lang === 'zh-Hans') return a;
    const out = Object.assign({}, a);
    DATA_FIELDS.forEach((k) => {
      if (typeof a[k] === 'string') out[k] = translateString(a[k], lang);
    });
    // city 形如「香港 · 中环」——分段翻译
    if (typeof a.city === 'string' && lang === 'en') {
      out.city = a.city.split('·').map((s) => translateString(s.trim(), lang)).join(' · ');
    }
    // area 形如「中环 / 金钟 / 尖沙咀」——分段翻译
    if (typeof a.area === 'string' && lang === 'en') {
      out.area = a.area.split('/').map((s) => translateString(s.trim(), lang)).join(' / ');
    }
    ARRAY_FIELDS.forEach((k) => {
      if (Array.isArray(a[k])) out[k] = a[k].map((s) => translateString(s, lang));
    });
    if (Array.isArray(a.workCaptions)) {
      out.workCaptions = a.workCaptions.map((c) => ({
        t: translateString(c.t, lang),
        s: translateString(c.s, lang),
      }));
    }
    return out;
  }

  /* 全站应用 */
  function apply(lang) {
    lang = lang || currentLang();
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : lang);

    // <title>
    if (document.title) {
      if (!document.__mdTitleSrc) document.__mdTitleSrc = document.title;
      document.title = translateString(document.__mdTitleSrc, lang);
    }

    applyToDom(document.body, lang);
    document.dispatchEvent(new CustomEvent('md:langchange', { detail: { lang } }));
  }

  function setLang(lang) {
    if (!LANGS.some((l) => l.code === lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
    renderSwitcher();
  }

  /* 语言切换器 UI */
  const SWITCH_HOSTS = ['langSwitch', 'langSwitchMobile'];

  function renderSwitcher() {
    const cur = currentLang();
    const html = LANGS.map(
      (l) => `<button type="button" class="lang-btn${l.code === cur ? ' active' : ''}"
        data-lang="${l.code}" title="${l.title}" aria-label="${l.title}"
        aria-pressed="${l.code === cur}">${l.label}</button>`
    ).join('');
    SWITCH_HOSTS.forEach((id) => {
      const host = document.getElementById(id);
      if (host) host.innerHTML = html;
    });
  }

  function bindSwitcher() {
    SWITCH_HOSTS.forEach((id) => {
      const host = document.getElementById(id);
      if (!host || host.__bound) return;
      host.__bound = true;
      host.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn) setLang(btn.dataset.lang);
      });
    });
  }

  /* 启动 */
  function init() {
    bindSwitcher();
    renderSwitcher();
    apply(currentLang());
    // 动态内容渲染后再补一次（渲染函数会触发）
    document.addEventListener('md:rerender', () => apply(currentLang()));
  }

  window.MDI18N = {
    LANGS,
    currentLang,
    setLang,
    apply,
    translateString,
    translateArtist,
    init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
