const router = require('koa-router')();
const user = require('./user-router');
const sms = require('./sms-router');
const upload = require('./upload-router');
// 装载路由
// 用户
 router.use('/test/user', user.routes(), user.allowedMethods());
// 短信
 router.use('/test/sms', sms.routes(), sms.allowedMethods());
// 上传
router.use('/test/upload', upload.routes(), upload.allowedMethods());
module.exports = router;
