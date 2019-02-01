const router = require('koa-router')();
const userInfoController = require('../controllers/user-info');
// 查询
router.post('/queryPhone', userInfoController.queryPhone);
// 登录
router.post('/login', userInfoController.Login);
// 注册
router.post('/register', userInfoController.Register);
module.exports = router;
