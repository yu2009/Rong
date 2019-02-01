const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true, // 唯一
        require: true // 验证
    },
    phoneNumber: {
        type: String,
        unique: true, // 唯一
        require: true // 验证
    },
    password: String,
    token: {
        type: String,
        unique: true
    },
    create_time: Date
});
UserSchema.pre('save', function (next) {
    this.create_time = Date.now();
    next();
});
module.exports = mongoose.model('User', UserSchema);
