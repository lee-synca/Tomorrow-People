// Bundles redesign/ into one self-contained HTML file: CSS, JS, fonts and
// images all inlined as data: URIs. No external requests at runtime.
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'redesign');
const OUT = path.join(process.cwd(), 'tomorrow-people.html');

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
};

let inlined = 0, assetBytes = 0;

function dataUri(file) {
  const buf = readFileSync(file);
  assetBytes += buf.length;
  inlined++;
  const mime = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// Rewrite url(...) inside a stylesheet, resolving relative to that file.
function inlineCss(cssFile) {
  const dir = path.dirname(cssFile);
  return readFileSync(cssFile, 'utf8').replace(
    /url\(\s*(['"]?)([^)'"]+)\1\s*\)/g,
    (whole, _q, ref) => {
      if (/^(data:|https?:|\/\/)/i.test(ref)) return whole;
      const abs = path.resolve(dir, ref);
      try { return `url(${dataUri(abs)})`; }
      catch { console.warn('  ! missing ' + ref); return whole; }
    }
  );
}

let html = readFileSync(path.join(SRC, 'index.html'), 'utf8');

// <link rel="stylesheet" href="..."> -> <style>
html = html.replace(
  /[ \t]*<link rel="stylesheet" href="([^"]+)">\n?/g,
  (_m, href) => `<style>\n${inlineCss(path.join(SRC, href))}\n</style>\n`
);

// <script src="..."> -> inline
html = html.replace(
  /[ \t]*<script src="([^"]+)"><\/script>/g,
  (_m, src) => `<script>\n${readFileSync(path.join(SRC, src), 'utf8')}\n</script>`
);

// remaining src="" / href="" asset references
html = html.replace(
  /(src|href)="([^"]+\.(?:png|jpe?g|gif|svg|webp|ico))"/gi,
  (whole, attr, ref) => {
    if (/^(data:|https?:|\/\/)/i.test(ref)) return whole;
    try { return `${attr}="${dataUri(path.join(SRC, ref))}"`; }
    catch { console.warn('  ! missing ' + ref); return whole; }
  }
);

writeFileSync(OUT, html, 'utf8');

const kb = n => (n / 1024).toFixed(0) + 'KB';
console.log(`inlined ${inlined} assets (${kb(assetBytes)} raw)`);
console.log(`wrote ${OUT} — ${kb(statSync(OUT).size)}`);
const leftovers = html.match(/(?:src|href)="(?!data:|#|https?:)[^"]+"/g);
console.log('unresolved local refs:', leftovers ? leftovers.join(', ') : 'none');
