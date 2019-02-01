let mongoose = require('mongoose');
let ArticleSchema = new mongoose.Schema({
    title: String, // 文章标题
    author: String, // 作者
    describe: String, // 描述
    date: String, // 定时日期
    time: String, // 定时时间
    content: String, // 文章内容
    cover: String, // 封面地址
    create_time: Date,
    update_time: Date, // 编辑时间
});
ArticleSchema.pre('save', function (next) {
    this.create_time = Date.now();
    next();
});
module.exports = mongoose.model('Article', ArticleSchema);
