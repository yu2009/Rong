const mongoose = require('mongoose');
// 引入 userSchema
const UserSchema = require('./schemas/user');
mongoose.connect('mongodb://localhost/rong', {useNewUrlParser: true});
let db = mongoose.connection;
// 防止Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
db.on('error', function () {
    console.log('数据库链接错误');
});
db.on('open', function () {
    console.log('数据库链接成功');
});
// 根据schema生成model
let User = mongoose.model('User', UserSchema);
module.exports = User;
/** 2018/12/27 11:10
 *author::^_夏流_^
 *describe: 数据库连接
 */
