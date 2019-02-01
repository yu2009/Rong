const router = require('koa-router')();
const smsController = require('../controllers/sms');
router.post('/sending_sms', smsController);
module.exports = router;
