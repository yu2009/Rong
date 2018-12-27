let mongoose = require('mongoose');
let UserSchema = require('../schemas/user');
let User = mongoose.model('User', UserSchema);
module.exports = User;
/** 2018/12/26 17:57
 *author::^_夏流_^
 *describe:
 */
