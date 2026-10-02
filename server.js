// Minimal static server for Railway. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PUBLIC = new Set(['index.html']);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/health') { res.writeHead(200); return res.end('ok'); }

  const file = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const allowed = PUBLIC.has(rel) || rel.startsWith('examples/');
  if (!allowed) { res.writeHead(404); return res.end('Not found'); }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(process.env.PORT || 3000, () => console.log('strategy-call-portal up'));
