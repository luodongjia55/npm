import {
  think
} from 'thinkjs';

const userModel = think.model('billion_user');
const orderModel = think.model('billion_order');
const WXBizDataCrypt = require('./WXBizDataCrypt');
const request = require('request');
const Q = require('q');
// const appId = 'wx33d82f168cad98c8';
// const secret = 'a27e7213ceb910c46a48d02b5fe0dea0';

const appId = 'wx125b36cb07bd5105';
const secret = 'a3728004b219fafa3f4af83949539180';

module.exports = class extends think.Service {
  /**
   * 获取手机号
   * @param {*} code 
   * @param {*} encryptedData 
   * @param {*} iv 
   */
  async getPhoneUser(code, encryptedData, iv) {
    let that = this;
    let jscode2session = await that.getSessionKey(code);
    if (jscode2session.errcode == 40029) {
      return "code已过期，请重新生成";
    }
    let sessionKey = jscode2session.session_key;
    if (!sessionKey) {
      return 'code已过期，请重新生成';
    }
    let p = that.getPhoneNumber(sessionKey, encryptedData, iv);
    return p
  }
  async getSessionKey(code) {
    let deferred = Q.defer();
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        deferred.resolve(JSON.parse(body));
      }
    })
    return deferred.promise;
  }
  async getPhoneNumber (sessionKey, encryptedData, iv) {
    let pc = new WXBizDataCrypt(appId, sessionKey)
    let data = '';
    try {
      data = pc.decryptData(encryptedData, iv);
    } catch (e) {
      data = '用户授权失败，请刷新页面重新授权';
    }
    return data;
  }
  /**
   * 注册用户
   * @param {*}} phoneNum 
   * @return id
   */
  async thenAddUser(phoneNum){
    let uuid = think.uuid('v4');
    let user = {
      id:uuid,
      phone_num:phoneNum
    }
    let cond = {
      phone_num: phoneNum,
      is_deleted:0
    }
    let users = await userModel.thenAdd(user, cond);
    return userModel
    .where(cond).find();
  }
  /**
   * 获取一个唯一凭证
   */
  token() {
    return think.md5(think.datetime(Date.now()) + think.uuid('v4'));
  }
   /**
   * 登录成功
   * @param {*} id 用户唯一标识
   * @param {*} token 登录鉴权
   */
  async loginSuccess(id, token) {
    await userModel.where({
      id
    }).update({
      last_login_time: think.datetime(Date.now()),
      token
    })
  }
  /**
   * 根据token查询用户信息
   * @param {*} token 
   */
  async getUserByToken(token) {
    return await userModel
      .where({
        token,
        is_deleted: 0
      }).find();
  }
  /**
   * 查询我的信息
   * @param {*} user_id 
   */
  async getMyInfo(user_id){
    let user = await userModel.where({
      id: user_id,
      is_deleted:0
    }).find();
    let data ={
      user:{
        create_at:new Date(user.create_time).getTime(),
        phone_num:user.phone_num
      },
      club:[]
    }
    let orders = await orderModel.where({user_id:user_id,order_status:200,is_delete:0}).order('create_time desc').select();
    orders.forEach(item => {
       let resItem = {
         name : item.name,
         user_name : item.user_name,
         user_phone : item.user_phone,
         price : item.price,
         interest : item.interest,
         begin_at : new Date(item.create_time).getTime(),
         end_at : new Date(item.due_time).getTime()
       }
       data.club.push(resItem);
    });
    return data;
  }
}