/* Kiểm tra cú pháp mọi tệp .js/.cjs của dự án (trừ node_modules, báo cáo sinh tự động). Dùng: npm run check */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'playwright-report', 'test-results']);
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!SKIP.has(entry.name)) walk(path.join(dir, entry.name)); }
    else if (/\.(c?js)$/.test(entry.name)) files.push(path.join(dir, entry.name));
  }
})(root);

let failed = 0;
for (const file of files.sort()) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) { failed++; console.error(`LỖI cú pháp: ${path.relative(root, file)}\n${r.stderr}`); }
}
console.log(`Đã kiểm tra cú pháp ${files.length} tệp JavaScript: ${failed ? failed + ' lỗi' : 'không có lỗi'}.`);
process.exit(failed ? 1 : 0);
