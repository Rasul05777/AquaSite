import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const portArg = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portArg >= 0 && process.argv[portArg + 1]) || 5173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.ttf':'font/ttf' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    const target = path.resolve(root, relative.startsWith('images/') ? `public/${relative}` : relative);
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const allowed = target === path.join(root, 'index.html') || target.startsWith(path.join(root, 'src') + path.sep) || target.startsWith(path.join(root, 'public') + path.sep);
    if (!allowed) { res.writeHead(404).end(); return; }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type':mime[path.extname(target)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Local: http://localhost:${port}`));
