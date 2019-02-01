const Koa = require('koa');
const convert = require('koa-convert');
const koaLogger = require('koa-logger');
const cors = require('koa2-cors');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const mongoose =require('mongoose');
const config = require('./config');
const routers = require('./routes');
const app = new Koa();
// 配置控制台日志中间件
app.use(convert(koaLogger()));
// bodyparser:该中间件用于post请求的数据
app.use(bodyParser());
// 跨域请求
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
// 配置静态资源中间件
app.use(static(__dirname + '/assets/uploads'));
// 加载路由中间件
app.use(routers.routes()).use(routers.allowedMethods());
// 数据库链接
mongoose.connect(config.database, {useCreateIndex: true});
let db = mongoose.connection;
// 防止Mongoose: mpromise 错误 赋值一个全局Promise
mongoose.Promise = global.Promise;
db.on('error', function () {
    console.log('数据库链接错误');
});
db.on('open', function () {
    console.log('数据库链接成功');
});
app.listen(3000, () => {
    console.log('The server is running at http://localhost:' + 3000);
});
/** 2018/12/27 10:41
 *author::^_夏流_^
 *describe: server 启动入口
 */
