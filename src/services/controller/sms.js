const QcloudSms = require('qcloudsms_js');
const redis = require('../../utils/redis');
// 短信应用SDK AppID
const appid = '1400175540';
// 短信应用SDK AppKey
const appkey = 'c81940702a4524a6df87819e3d7b477e';
// 短信模板ID，需要在短信应用中申请
let templateId = '260313';  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
//templateId 7839 对应的内容是"您的验证码是: {1}"
// 签名
let SmsSign = '绒社区';  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
// 实例化QcloudSms
let qcloudsms = QcloudSms(appid, appkey);
let ssender = qcloudsms.SmsSingleSender();

const sms = async (ctx) => {
    // 随机验证码
    let randomNum = ('' + Math.random()).slice(-6);
    // 模板中变量
    let params = [randomNum, '5'];
    let phoneNumber = ctx.request.body.phoneNumber;
    if ((/^1[3-9]\d{9}$/.test(phoneNumber))) {
        let count;
        await redis.get(phoneNumber + 'count', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                count = parseInt(res | 0);
            }
        });
        if (count === 5) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '已到达今日上限!',
            };
        } else {
            let phoneNumbers = [phoneNumber]; // 需要发送短信的手机号码
            await new Promise((resolve, reject) => {
                ssender.sendWithParam('86', phoneNumbers[0], templateId,
                    params, SmsSign, '0', '', (err, res, resData) => {
                        if (err) {
                            reject();
                        } else {
                            if (resData.result === 0) {
                                redis.set(phoneNumber, randomNum);
                                redis.set(phoneNumber + 'count', count + 1);
                                ctx.status = 200;
                                ctx.body = {
                                    success: true,
                                    message: resData.errmsg === 'OK' ? '验证码发送成功!' : resData.errmsg,
                                };
                            } else {
                                ctx.status = 200;
                                ctx.body = {
                                    success: false,
                                    message: resData.errmsg,
                                };
                            }
                            resolve();
                        }
                    });
            });
        }
    } else {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: '手机号码错误!',
        };
    }
};
module.exports = sms;
/** 2019/1/4 11:04
 *author::^_夏流_^
 *describe: 腾讯云短信验证
 */
