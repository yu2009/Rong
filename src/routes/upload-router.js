const router = require('koa-router')();
const uploading = require('../controllers/upload');
const upload = require('../config/upload-img-config');
router.post('/uploading', upload.single('filename'), uploading);
module.exports = router;
