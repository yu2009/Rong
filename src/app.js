const Koa = require('koa');
const sha1 = require('sha1'); // 用于密码加密
const router = require('koa-router')(); // 路由模块
const bodyParser = require('koa-bodyparser'); // koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
const path = require('path');
const static = require('koa-static'); // 静态资源中间件
/*** mongoose ***/
const mongoose = require('mongoose');
const User = require('./services/models/user');
mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true}); // 链接数据库
/*** mongoose ***/
const moment = require('moment'); // 用于生成时间
const objectIdToTimestamp = require('objectid-to-timestamp'); // 用于生成时间
const app = new Koa();
app.use(bodyParser()); // 通过ctx.request.body
app.use(static(path.join(__dirname), 'public'));
/*数据库操作*/
/*根据用户名查找用户*/
const findUser = (userName) => {
    return new Promise((resolve, reject) => {
        User.findOne({userName}, (err, doc) => {
            if (err) {
                reject(err);
            }
            resolve(doc);
        });
    });
};
/*登录*/
const Login = async (ctx) => {
    let userName = ctx.request.body.userName;
    let password = sha1(ctx.request.body.password);
    let doc = await findUser(userName);
    if (!doc) {
        console.log('检查到用户名不存在');
        ctx.status = 200;
        ctx.body = {
            info: false
        };
    } else if (doc.password === password) {
        console.log('密码一致!');
        //生成一个新的token,并存到数据库
        let token = createToken(userName);
        console.log(token);
        doc.token = token;
        await new Promise((resolve, reject) => {
            doc.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        ctx.status = 200;
        ctx.body = {
            success: true,
            userName,
            token, //登录成功要创建一个新的token,应该存入数据库
            create_time: doc.create_time
        };
    } else {
        console.log('密码错误!');
        ctx.status = 200;
        ctx.body = {
            success: false
        };
    }
};
/*注册*/
const Register = async (ctx) => {
    let user = new User({
        username: ctx.request.body.userName,
        password: sha1(ctx.request.body.password), //加密
        token: createToken(this.userName), //创建token并存入数据库
        create_time: moment(objectIdToTimestamp(user._id)).format('YYYY-MM-DD HH:mm:ss'),//将objectid转换为用户创建时间
    });
    //将objectid转换为用户创建时间(可以不用)
    user.create_time = moment(objectIdToTimestamp(user._id)).format('YYYY-MM-DD HH:mm:ss');

    let doc = await findUser(user.userName);
    if (doc) {
        console.log('用户名已经存在');
        ctx.status = 200;
        ctx.body = {
            success: false
        };
    } else {
        await new Promise((resolve, reject) => {
            user.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        console.log('注册成功');
        ctx.status = 200;
        ctx.body = {
            success: true
        };
    }
};
// 获取post提交的数据
//引入配置中间件
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
