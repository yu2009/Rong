/*
* 文件上传
* */
const multer = require('koa-multer');
//配置
let storage = multer.diskStorage({
    // 文件保存路径
    destination: (req, file, cb) => {
        cb(null, './assets/uploads/')
    },
    // 修改文件名称
    filename: (req, file, cb) => {
        let fileFormat = (file.originalname).split('.');//以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
});
// 加载配置
let upload = multer({storage: storage});
module.exports = upload;