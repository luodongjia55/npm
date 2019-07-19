import {
  think
} from 'thinkjs';
const Base = require('./base.js');
const userService = think.service('billion_user');


module.exports = class extends Base {
  async my_infoAction(){
    const user_id = this.ctx.user.id; 
    let [err,result] = await this.awaitWrap(userService.getMyInfo(user_id));
    if(err){
      return this.fail(err)
    }else{
      return this.success(result);
    }
  }
};