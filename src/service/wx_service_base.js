import {
  think
} from 'thinkjs';
const request = require('request');
const Q = require('q');
const crypto = require('crypto');
const payHost = (think.env === 'development') ? 'https://bcdev.zlycare.com' : ''
const noncestr = 'Wm3WZYTPz34dsfkjkd';
const xml2js = require('xml2js');
const MD5 = require('./md5');

/**
 * MD5加密
 * @param data
 * @returns {*}
 */
const commonMD5 = function (data, salt, upper) {
  if (data && salt) data += salt;
  // console.log("data:" + data);
  if (upper)
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
  else
    return crypto.createHash('md5').update(data).digest('hex');
};

const getSessionKey = function (code, appId, secret) {
  let deferred = Q.defer();
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        deferred.resolve(JSON.parse(body));
      }
    })
    return deferred.promise;
};

const parseXml = function (data) {
  var deferred = Q.defer();
  xml2js.parseString(data, {
    explicitArray: false,
    ignoreAttrs: true
  },
    function (err, result) {
      deferred.resolve(result);
    });

  return deferred.promise;
};

module.exports = class extends think.Service {
  constructor(appid, secret, mchId, mchKey, url) {
    super();
    this.appid = appid;
    this.secret = secret;
    this.mchId = mchId;
    this.mchKey = mchKey;
    this.payNotifyUrl = payHost + url
  }
  /**
   * 微信公众号支付
   * @param data
   * {
   *   money:支付金额(元)
   *   tradeNo:内部订单号
   *   body:充值提示
   *   openid : 微信唯一标识
   * }
   * @returns 
   */
  async WXPayApplet(ip, data) {
    if (data.money <= 0) {
      throw {
        code: 1206,
        msg: '支付金额必须大于0'
      }
    }
    const rechargeMoney = data.money; //微信充值单位为分
    const outTradeNo = data.tradeNo;
    const body = data.body;
    const openid = data.openid
    const tradeType = "JSAPI";
    ip = '127.0.0.1'
    console.log("ip: " + ip);
    const stringA = "appid=" + this.appid + "&" +
      "body=" + body + "&" +
      "mch_id=" + this.mchId + "&" +
      "nonce_str=" + noncestr + "&" +
      "notify_url=" + this.payNotifyUrl + "&" +
      "openid=" + openid + "&" +
      "out_trade_no=" + outTradeNo + "&" +
      "spbill_create_ip=" + ip + "&" +
      "total_fee=" + rechargeMoney + "&" +
      "trade_type=" + tradeType + "&" +
      "key=" + this.mchKey;

    //stringA = (new Buffer(stringA)).toString('UTF-8');
    var sign = commonMD5(stringA, "", true);

    console.log("stringA-->" + stringA + "-----" + sign);

    var payload = '<xml> ' +
      '<appid>' + this.appid + '</appid> ' +
      '<mch_id>' + this.mchId + '</mch_id> ' +
      '<nonce_str>' + noncestr + '</nonce_str> ' +
      '<sign>' + sign + '</sign> ' +
      '<body>' + body + '</body> ' +
      '<out_trade_no>' + outTradeNo + '</out_trade_no> ' +
      '<total_fee>' + rechargeMoney + '</total_fee> ' +
      '<spbill_create_ip>' + ip + '</spbill_create_ip> ' +
      '<notify_url>' + this.payNotifyUrl + '</notify_url> ' +
      '<trade_type>' + tradeType + '</trade_type> ' +
      '<openid>' + openid + '</openid>' +
      '</xml>';

    const defer = Q.defer();
    let options = {
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: "POST",
      headers: {
        "content-type": "application/xml",
      },
      body: payload
    }
    request(options, function (error, response, body) {
      parseXml(body).then(xmlRes => {
        if (!error && response.statusCode == 200) {
          if (xmlRes.xml.return_code == 'SUCCESS' && xmlRes.xml.result_code == 'SUCCESS') { //下单成功
            const result = xmlRes.xml.prepay_id;
            defer.resolve(result);
          } else {
            const payError = {
              code: '1207',
              message: ''
            };
            payError.message += "," + (xmlRes.xml.err_code_des || xmlRes.xml.return_msg);

            defer.reject(payError);
          }
        } else {
          console.log(error);
        }
      })
    });
    return defer.promise
  }
  /**
   * 通过code获取openid
   * @param {*} code 
   */
  async get_openid(code) {
    let result =  await getSessionKey(code, this.appid, this.secret);
    console.log(result);
    if(result && result.openid){
      return result.openid;
    }else{
      throw 'code已失效，请重新获取';
    }
  }

  /**
   * 生成微信支付参数集
   * @param {*} orderId 
   */
  async getPayParam(orderId = 1) {
    const _package = ['prepay_id', '=', orderId].join('');
    const timeStamp = Date.now() + '';
    const nonceStr = think.uuid('v4').replace(/-/g, '');
    let paySign = `appId=${this.appid}&nonceStr=${nonceStr}&package=${_package}&signType=MD5&timeStamp=${timeStamp}&key=${this.mchKey}`;
    paySign = (MD5(paySign)).toUpperCase();
    return {
      appId: this.appid,
      timeStamp,
      nonceStr,
      package: `prepay_id=${orderId}`,
      signType: 'MD5',
      paySign
    }
  }

  async checkWxPay(data) {
    let sign;
    let dataArray = [];
    let weixinKey = this.mchKey;
    Object.keys(data).forEach(function (key) {
      if (data[key][0]) {
        if (key == 'sign') {
          sign = data[key][0];
        } else {
          dataArray.push(key + "=" + data[key][0]);
        }
      }
    });
    var dataStr = dataArray.sort().join('&') + '&key=' + weixinKey;
    var genSign = commonMD5(dataStr, '', true);
    console.log('sign:', dataStr, sign, genSign);
    return genSign == sign;
  };
};