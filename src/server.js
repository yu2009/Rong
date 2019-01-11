const Koa = require('koa');
const cors = require('koa2-cors'); // 跨域请求
const app = new Koa();
// router
const Router = require('koa-router');
//父路由
const router = new Router();
// bodyparser:该中间件用于post请求的数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(cors({
    origin: function (ctx) {
        // 测试接口允许来自所有域名请求
        if (ctx.url.indexOf('/test') >= 0) {
            return '*';
        }
        // 只允许 http://localhost:8090 这个域名的请求了
        return 'http://rong_web.helptechltd.com';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true, // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
// 引入数据库操作方法
const UserController = require('./services/controller/user.js');
// 短剑接口
const smsController = require('./services/controller/sms.js');
// checkToken 作为中间件存在
const checkToken = require('./services/token/check-token.js');
// 查询
router.post('/queryPhone', UserController.queryPhone);
// 登录
router.post('/login', UserController.Login);
// 注册
router.post('/register', UserController.Register);
// 短信
router.post('/sms', smsController);
// 装载路由
router.use('/test', router.routes(), router.allowedMethods()); // 测试
// router.use('/api', router.routes(), router.allowedMethods()); // 线上
//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log('The server is running at http://localhost:' + 3000);
});
/** 2018/12/27 10:41
 *author::^_夏流_^
 *describe: server 启动入口
 */
