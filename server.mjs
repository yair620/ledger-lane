import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT) || 4174;
const root = fileURLToPath(new URL('./public/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

createServer(async (req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const safe = normalize(relative).replace(/^([.][.][\\/])+/, '');
  // Mirror Cloudflare Pages routing: an extensionless request resolves to the matching .html file.
  for (const candidate of [safe, `${safe}.html`, join(safe, 'index.html')]) {
    try {
      const file = await readFile(join(root, candidate));
      res.writeHead(200, { 'content-type': types[extname(candidate)] || 'application/octet-stream', 'cache-control': 'no-store' });
      return res.end(file);
    } catch { /* try the next candidate */ }
  }
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}).listen(port, '127.0.0.1', () => console.log(`Ledger Lane listening on http://127.0.0.1:${port}`));
