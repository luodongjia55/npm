import {
  think
} from 'thinkjs';
const Base = require('./base.js');
const wx_service = think.service('billion_wx_service');


module.exports = class extends Base {
  /**
   * 微信支付回掉
   */
  async indexAction() {
      const data = this.post();
      const isValid = await wx_service.checkWxPay(data.xml);
      console.log('isValid:', isValid);
      if (data.xml.return_code[0] == 'SUCCESS' && data.xml.result_code[0] == 'SUCCESS' && isValid) {
          console.log("WxPay Callback Success");
          const order_id = data.xml.out_trade_no[0];
          const typeLetter = order_id.substring(0, 1);
          if (typeLetter == 'B') {
              const billion_service = think.service('billion_order');
              await billion_service.payOrder(order_id);
          }
          var resData = "<xml>" +
              " <return_code><![CDATA[" + "SUCCESS" + "]]></return_code>" +
              " <return_msg><![CDATA[" + "OK" + "]]></return_msg>" +
              "</xml>";
          this.ctx.body = resData
          //this.success(resData);
      } else {
          var resData = "<xml>" +
              " <return_code><![CDATA[" + "FAIL" + "]]></return_code>" +
              " <return_msg><![CDATA[" + (isValid ? data.xml.return_msg[0] : '签名失败') + "]]></return_msg>" +
              "</xml>";
          this.ctx.body = resData 
          //this.success(resData);
      }


  }
};