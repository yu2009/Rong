const Koa = require('koa');
const sha1 = require('sha1');
const router = require('koa-router')(); // 路由模块
const bodyParser = require('koa-bodyparser'); // koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
const path = require('path');
const static = require('koa-static'); // 静态资源中间件
const app = new Koa();
app.use(bodyParser()); // 通过ctx.request.body 获取post提交的数据
app.use(static(path.join(__dirname), 'public')); //引入配置中间件
// app.use(async (ctx) => {
//     ctx.body = 'hello koa2';
// });
router.get('/', async (ctx, next) => { // ctx 是 Koa的应用上下文 next 串联中间件的钩子
    ctx.body = 'Hello koa';
});
router.get('/news', async (ctx, next) => {
    // ctx.body = '新闻页' + ctx.url;
    let url = ctx.url;
    //从request中获取GET请求
    let request = ctx.request;
    let req_query = request.query;
    let req_querystring = request.querystring;
    //从上下文中直接获取
    let ctx_query = ctx.query;
    let ctx_querystring = ctx.querystring;
    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    };
});
// 动态路由
router.get('/product/:id', async (ctx) => {
    let id = ctx.params.id;
    ctx.body = '这是商品页' + id;
});
app.use(router.routes()); // 启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
app.listen(3000, () => {
    console.log('[demo] start-quick is starting at port 3000');
});

/** 2018/12/20 10:54
 *author::^_夏流_^
 *describe:
 */
