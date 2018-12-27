const Koa = require('koa');
const cors = require('koa2-cors');
const app = new Koa();
// router
const Router = require('koa-router');
//父路由
const router = new Router();
// bodyparser:该中间件用于post请求的数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(cors());
// 引入数据库操作方法
const UserController = require('./services/controller/user.js');
// checkToken 作为中间件存在
const checkToken = require('./services/token/check-token.js');
// 登录
router.post('/login', UserController.Login);
//注册
router.post('/register', UserController.Register);
// 装载路由
router.use('/api', router.routes(), router.allowedMethods());
//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log('The server is running at http://localhost:' + 3000);
});
/** 2018/12/27 10:41
 *author::^_夏流_^
 *describe: server 启动入口
 */
