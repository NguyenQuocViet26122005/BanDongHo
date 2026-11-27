/* Kiểm tra mọi liên kết nội bộ trong HTML (href/src), CSS (url) và Markdown còn trỏ tới tệp tồn tại. Dùng: npm run check:links */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'playwright-report', 'test-results']);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name)); }
    else if (/\.(html|css|md)$/.test(e.name)) files.push(path.join(dir, e.name));
  }
})(root);

const external = u => /^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(u) || u.includes('${') || u.includes('{{');
const broken = []; let checked = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8'); const ext = path.extname(file);
  const refs = [];
  const grab = (re, group) => { for (const m of text.matchAll(re)) refs.push({ url: m[group], line: text.slice(0, m.index).split('\n').length }); };
  if (ext === '.html') grab(/\b(?:href|src)="([^"]+)"/g, 1);
  if (ext === '.css') grab(/url\((['"]?)([^)'"]+)\1\)/g, 2);
  if (ext === '.md') grab(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, 1);
  for (const { url, line } of refs) {
    if (external(url)) continue;
    const clean = decodeURIComponent(url.split('#')[0].split('?')[0]); if (!clean) continue;
    const target = path.resolve(path.dirname(file), clean);
    checked++;
    if (!fs.existsSync(target)) broken.push(`${path.relative(root, file)}:${line}  ${url}`);
  }
}
if (broken.length) { console.error(`Có ${broken.length} liên kết hỏng:\n` + broken.join('\n')); process.exit(1); }
console.log(`Đã kiểm tra ${checked} liên kết nội bộ trong ${files.length} tệp (HTML, CSS, Markdown): không có liên kết hỏng.`);
