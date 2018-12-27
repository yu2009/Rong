// 生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
// 加密
const sha1 = require('sha1');
const User = require('../db.js');
const createToken = require('../token/create-token.js');
// 数据库操作
// 根据用户名查找用户
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
// 登录
const Login = async (ctx) => {
    // 拿到账号密码
    let userName = ctx.request.body.userName;
    let password = sha1(ctx.request.body.password);
    let doc = await findUser(userName);
    if (!doc) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: '用户不存在!'
        };
    } else if (doc.password === password) {
        //生成一个新的token,并存到数据库
        let token = createToken(userName);
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
            message: '登录成功!',
            userName,
            token, //登录成功要创建一个新的token,应该存入数据库
            create_time: doc.create_time
        };
    } else {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: '密码错误!',
        };
    }
};
//注册
const Register = async (ctx) => {
    let user = new User({
        userName: ctx.request.body.userName,
        password: sha1(ctx.request.body.password), //加密
        token: createToken(this.userName), //创建token并存入数据库
    });
    //将objectid转换为用户创建时间(可以不用)
    user.create_time = moment(objectIdToTimestamp(user._id)).format('YYYY-MM-DD HH:mm:ss');
    let doc = await findUser(user.userName);
    if (doc) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: '用户名已经存在!'
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
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: '注册成功'
        };
    }
};
module.exports = {
    Login,
    Register
};
/** 2018/12/27 10:49
 *author::^_夏流_^
 *describe: user 数据库操作方法
 */
