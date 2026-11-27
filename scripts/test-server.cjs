// Máy chủ tĩnh dành riêng cho kiểm thử; người dùng vẫn chạy Go Live bình thường.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
// Trang vào (HTML) nằm ở gốc để giữ nguyên địa chỉ /home.html, /index.html...
const allowed=new Set([
  '/index.html','/home.html','/product.html','/cart.html','/checkout.html','/order-success.html',
  '/login.html','/register.html','/account.html','/orders.html','/order-detail.html','/wishlist.html',
  '/about.html','/contact.html','/qa.html','/qa-portfolio.html','/lab.html'
]);
// Chỉ phục vụ thư mục tài nguyên; KHÔNG phục vụ mã test (tests/unit, tests/e2e), scripts, package.json, node_modules.
const resourcePrefixes=['/css/','/js/','/assets/','/docs/','/skills/','/tests/katalon/','/tests/jmeter/','/tests/selenium-ide/'];
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.csv':'text/csv; charset=utf-8','.md':'text/markdown; charset=utf-8','.groovy':'text/plain; charset=utf-8','.jmx':'application/xml; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.zip':'application/zip','.ttf':'font/ttf','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  let name;try{name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);return res.end();}
  if(name==='/')name='/index.html';
  if(name==='/favicon.ico'){res.writeHead(204,{'Cache-Control':'no-store'});return res.end();}
  const target=path.resolve(root,'.'+name),ext=path.extname(name);
  const resource=resourcePrefixes.some(prefix=>name.startsWith(prefix))&&Object.hasOwn(types,ext);
  if(!target.startsWith(root+path.sep)||(!allowed.has(name)&&!resource)){res.writeHead(404);return res.end('Not found');}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end('Method not allowed');}
  fs.readFile(target,(err,data)=>{
    if(err){res.writeHead(404);return res.end('Not found');}
    res.writeHead(200,{'Content-Type':types[ext],'Content-Length':data.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
  });
});
const port=Number(process.env.PORT||5517);
server.listen(port,'127.0.0.1',()=>console.log(`AUREL local: http://127.0.0.1:${port}/qa.html`));
server.on('error',err=>{console.error(err.message);process.exitCode=1;});
