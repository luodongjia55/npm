import {
  think
} from 'thinkjs';
const userService = think.service('billion_user');
const v_model = think.model('version');


module.exports = class extends think.Controller {
  /**
   * 1003 登录
   * @method : POST
   * @param code
   * @param encryptedData
   * @param iv
   */
  async loginAction() {
    const post = this.ctx.post();
    const code = post.code;
    const encryptedData = post.encryptedData;
    const status = post.status;
    const iv = post.iv;
    let phone_num = '18555555555';
    //获取手机号
    if(status==2){//正常用户登录
      let result = await userService.getPhoneUser(code, encryptedData, iv);
      phone_num = result.phoneNumber; 
      if (typeof result == 'string') {
        return this.success({
          code: '1000',
          msg: result
        })
      }  
    }
    let user = await userService.thenAddUser(phone_num);
    if (!think.isEmpty(user)) {
      let token = userService.token();
      await userService.loginSuccess(user.id, token);
      return this.success({
        data:{
          token,
          last_login_time: user.last_login_time || "",
          phone_num:user.phone_num
        }
      });
    } 
  }
  async checkAction(){
    const v = this.get('v');
    let check_login = false;
    const result = await v_model.where({
      is_delete: 0,
      version: v,
      status: 100
    }).select();
    if (result.length) {
      check_login = true;
    }
    return this.success({
      check_login
    })
  }
};