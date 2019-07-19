import {
  think
} from 'thinkjs';
const order_model = think.model('billion_order');

const goods = [
  {
    name : '百万俱乐部',
    interest : '体验1次线下会员活动',
    price : 1
  },
  {
    name : '千万俱乐部',
    interest : '体验1次线下会员活动',
    price : 1
  },
  {
    name : '亿万俱乐部',
    interest : '体验1次线下会员活动',
    price : 1
  }
]

module.exports = class extends think.Service {

  /**
   * 生成订单
   * @param string userId
   * @param {*} data 
   * @return {}
   */
  async create_order(user_id, ip, data, openid) {
    const util_service = think.service('util_service');
    let uuid = think.uuid('v4');
    let order_id = await util_service.createOrderId('B');
    let type = Number(data.type) - 1; 
    const new_order = {
      id: uuid,
      order_id,
      wx_order_id: '',
      order_status: 100,
      user_id,
      name:goods[type].name,
      price : goods[type].price,
      interest : goods[type].interest,
      user_name : data.user_name,
      user_phone : data.user_phone,
    }
    const wx_service = think.service('billion_wx_service');
    //openid = 'ooDEL0u5GkI-gujiWXB67Yh2t0aE'//await wx_service.get_openid('0610WSez0mygOf1nJigz0VCVez00WSeH');
    new_order.wx_order_id = await wx_service.WXPayApplet(ip, {
      money: 1,
      tradeNo: new_order.order_id,
      body: '123',
      openid
    })
    console.log('new order', new_order);
    await order_model.add(new_order);
    const payParam = await wx_service.getPayParam(new_order.wx_order_id);
    console.log(payParam);
    return {
      order_id: new_order.order_id,
      wx_order_id: new_order.wx_order_id,
      payParam
    };
  }

  /**
   * 支付订单
   * @param string order_id
   * @return {}
   */
  async payOrder(order_id) {
    let now_date = new Date();
    let due_time = think.datetime(now_date.setFullYear(now_date.getFullYear() + 1));
    const payRes = await order_model
      .where({
        order_id
      })
      .update({
        order_status: 200,
        due_time
      });
    return payRes;
  }
};