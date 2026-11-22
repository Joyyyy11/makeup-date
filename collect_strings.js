const fs = require('fs');
const { execSync } = require('child_process');

const set = new Set();

// 1) HTML 文本节点 + 属性
execSync('ls *.html').toString().trim().split('\n').forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/>([^<>{}`$\n]{1,80})</g)) {
    const t = m[1].trim();
    if (/[\u4e00-\u9fff]/.test(t)) set.add(t);
  }
  for (const m of s.matchAll(/(?:placeholder|title|aria-label|alt)="([^"]{1,80})"/g)) {
    const t = m[1].trim();
    if (/[\u4e00-\u9fff]/.test(t)) set.add(t);
  }
});

// 2) layout.js / hydrate.js 里的字符串字面量
['assets/layout.js', 'assets/hydrate.js', 'assets/hydrate-form.js'].forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/'([^']{1,80})'/g)) {
    const t = m[1].trim();
    if (/[\u4e00-\u9fff]/.test(t)) set.add(t);
  }
});

// 3) data.js 数据字段
const P = new Proxy({}, { get: (t, k) => 'IMG_' + k });
const { ARTISTS } = new Function('P', fs.readFileSync('assets/data.js', 'utf8') + '; return {ARTISTS};')(P);
ARTISTS.forEach((a) => {
  ['city', 'area', 'home', 'slots', 'bio'].forEach((k) => {
    if (a[k]) set.add(a[k]);
  });
  (a.tags || []).forEach((t) => set.add(t));
  (a.styles || []).forEach((t) => set.add(t));
  (a.workCaptions || []).forEach((c) => {
    set.add(c.t);
    set.add(c.s);
  });
});

// 4) 地区/片区：分段拆开
const splitArea = (s) =>
  String(s)
    .split(/[\/·]/)
    .map((x) => x.trim())
    .filter(Boolean);
[...set].forEach((s) => {
  if (/[\/·]/.test(s)) splitArea(s).forEach((p) => p.length >= 2 && set.add(p));
});

const arr = [...set].filter((s) => s.length >= 2 && /[\u4e00-\u9fff]/.test(s));
console.log('唯一待译字符串:', arr.length);
fs.writeFileSync('/tmp/strings.json', JSON.stringify(arr, null, 1));
console.log(arr.slice(0, 40).join('\n'));
