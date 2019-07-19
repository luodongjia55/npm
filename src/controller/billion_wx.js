import {
  think
} from 'thinkjs';
import base from './base'

module.exports = class extends base {
  async get_openidAction() {
    let that = this;
    const code = this.get('code');
    const wx_service = think.service('billion_wx_service');
    let [err, openid] = await this.awaitWrap(wx_service.get_openid(code));
    if (err) {
      return that.fail(err);
    } else {
      return that.success({
        open_id: openid
      });
    }
  }
  async update_versionAction() {
    const version = this.post('v');
    const status = this.post('status');
    const version_model = think.model('version');
    let result = await version_model.where({version}).find();
    if(result && result.id){
      await version_model.where({ version }).update({ status });
    }else{
      await version_model.add({version, status});
    }
    result = await version_model.where({version}).find();
    return this.success({
      result
    })
  }
};