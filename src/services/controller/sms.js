const QcloudSms = require('qcloudsms_js');
// 短信应用SDK AppID
const appid = '1400175540';
// 短信应用SDK AppKey
const appkey = 'c81940702a4524a6df87819e3d7b477e';
// 短信模板ID，需要在短信应用中申请
let templateId = '260313';  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
//templateId 7839 对应的内容是"您的验证码是: {1}"
// 签名
let SmsSign = '绒社区';  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
// 模板中变量
let params = ['1234', '5'];
// 实例化QcloudSms
let qcloudsms = QcloudSms(appid, appkey);
let ssender = qcloudsms.SmsSingleSender();
const sms = async (ctx) => {

    if (ctx.request.body.userName.length === 11) {
        let phoneNumbers = [ctx.request.body.userName]; // 需要发送短信的手机号码
        await new Promise((resolve, reject) => {
            ssender.sendWithParam('86', phoneNumbers[0], templateId,
                params, SmsSign, '0', '', (err, res, resData) => {
                    if (err) {
                        reject();
                    } else {
                        console.log(resData);
                        if (resData.result === 0) {
                            ctx.status = 200;
                            ctx.body = {
                                success: true,
                                message: resData.errmsg === 'OK' ? '验证码发送成功!' : resData.errmsg,
                            };
                        }
                        resolve();
                    }
                });
        });
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
