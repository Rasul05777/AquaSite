import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const portArg = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portArg >= 0 && process.argv[portArg + 1]) || 5173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.ttf':'font/ttf', '.mp4':'video/mp4' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    const target = path.resolve(root, relative.startsWith('images/') ? `public/${relative}` : relative);
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const allowed = target === path.join(root, 'index.html') || target.startsWith(path.join(root, 'src') + path.sep) || target.startsWith(path.join(root, 'public') + path.sep);
    if (!allowed) { res.writeHead(404).end(); return; }
    if (path.extname(target) === '.mp4') {
      const {size}=await stat(target);
      const range=req.headers.range;
      let start=0,end=size-1;
      if(range){
        const match=/^bytes=(\d*)-(\d*)$/.exec(range);
        if(!match || (!match[1] && !match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
        start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
        end=match[1]&&match[2]?Math.min(Number(match[2]),size-1):size-1;
        if(start>end || start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
      }
      res.writeHead(range?206:200,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1,...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
      if(req.method==='HEAD'){res.end();return;}
      createReadStream(target,{start,end}).pipe(res);return;
    }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type':mime[path.extname(target)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Local: http://localhost:${port}`));
