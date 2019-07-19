import {
  think
} from 'thinkjs';
const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * billion club 下单
   * @method post
   * @param user_name string
   * @param user_phone string
   * @param type string
   * @param openid string
   */
  async create_orderAction() {
    let that = this;
    const order_Service = think.service('billion_order');
    const post = this.ctx.post();
    const user =  this.ctx.user;
    let [err,result] = await this.awaitWrap(order_Service.create_order(user.id,this.ctx.ip,post,post.openid));
    if(err){
      return this.fail(err)
    }else{
      return this.success(result);
    }
    
  }

};