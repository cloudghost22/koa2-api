const Koa = require('koa')
  , path = require('path')
  , route = require('./server/routers/index')
  , json = require('koa-json')
  , logger = require('koa-logger')
  , kcros = require('koa2-cors')
  , BodyParser = require('koa-bodyparser')
  , koaStatic = require('koa-static')
  , koaJwt = require('koa-jwt');
// const historyApiFallback = require('koa-history-api-fallback'); // 引入各种依赖
//处理vue的history模式
const { historyApiFallback } = require('koa2-connect-history-api-fallback');

const jwtSecret = require('./server/config/db.js')

const app = new Koa();

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(historyApiFallback({ whiteList: ['/api','/ftpapi'] }));
app.use(koaStatic(path.resolve('./server/static')));
app.use(koaStatic(path.resolve('./server/static/upload')));
app.use(koaStatic(path.resolve('./server/static/dist')));

//跨域
app.use(kcros({
  origin: function (ctx) {
    return "*"; // 允许来自所有域名请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));


//post解析
app.use(BodyParser());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

//jwt 设置
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

//无需认证也可以访问的路径
app.use(koaJwt({ secret: jwtSecret.jwtSecret }).unless({
  path: [/^\/auth/,/^\/api\/showpress/,/^\/api\/showpaper/,/^\/login/,/^\/ftpapi/,]
}))

app.on('error', err => {
  log.error('server error', err)
});

//处理路由
app.use(route.routes());
app.use(route.allowedMethods());


app.listen(8889, () => {
  console.log('Koa is listening in 8889');
});

module.exports = app;