const Redis = require('ioredis');
const client = new Redis({
    host: '127.0.0.1', // redis服务器地址
    port: 6379, // 端口
    password: '12345', // 密码
    prefix: 'rong:', // 前缀
    ttl: 60 * 60 * 23, // 过期时间
    db: 0
});
client.on('error', error => {
    console.log('Redis数据库链接失败!', error);
});
client.on('ready', () => {
    console.log('Redis数据库准备成功！');
});
client.on('connect', () => {
    console.log('Redis数据库连接成功！');
});

module.exports = client;
/** 2019/1/10 10:58
 *author::^_夏流_^
 *describe: redis
 */
