/*
* 文件上传
* */
const uploading = async (ctx) => {
    let host = 'http://localhost:3000/';
    ctx.body = {
        success: false,
        message: '上传成功!',
        filename: ctx.req.file.filename,
        fileUrl: host + ctx.req.file.filename,
    };
}
module.exports = uploading;
