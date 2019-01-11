let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    userName: String,
    phoneNumber: String,
    password: String,
    token: String,
    create_time: Date
});
UserSchema.pre('save', function (next) {
    this.create_time = Date.now();
    next();
});
module.exports = UserSchema;
/** 2018/12/26 17:59
 *author::^_夏流_^
 *describe: 用戶
 */
