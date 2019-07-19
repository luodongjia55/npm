import {
  think
} from 'thinkjs';
const crypto = require('crypto');
const _ = require('underscore');
/**
 * 日期格式化方法
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

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

const getyyyyMMddhhmmss = function (time) {
  const d = new Date(time);
  return d.format("yyyyMMddhhmmss");
};

module.exports = class extends think.Service {
  /**
   * 生成订单号
   * 订单唯一标识 xxxx20171213111224
   * xxxx:为uuid md5 -> {0,3}
   * 20171213111224  秒
   * @param prefixes 订单前缀，标识订单类型
   * @return String
   */
  async createOrderId(prefixes) {
    let objectId = think.uuid('v4');
    let md5 = commonMD5(objectId);
    let xxxx = md5.substring(0, 4);
    let now = Date.now();
    return (prefixes || '') + xxxx + getyyyyMMddhhmmss(now);
  }
};