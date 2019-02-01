const jwt = require('jsonwebtoken');
module.exports = async (ctx, next) => {
    // 获取token
    const authorization = ctx.get('Authorization');
    if (authorization === '') {
        ctx.throw(401, 'no token detected in http headerAuthorization');
    }
    const token = authorization.split(' ')[1];
    let tokenContent;
    try {
        tokenContent = await jwt.verify(token, 'zjj'); // 如果token过期或验证失败，将抛出错误
    } catch (e) {
        ctx.throw(401, 'invalid token');
    }
    await next();
};
/** 2018/12/27 10:51
 *author::^_夏流_^
 *describe: 检查token 是否过期
 */
