const base = require('./base')
module.exports = class extends base {
  async create_orderAction() {
    this.allowMethods = 'post';

    const rules = {
      user_name: {
        string: true,
        trim: true,
        required: true
      },
      user_phone: {
        string: true,
        trim: true,
        required: true
      },
      type: {
        string: true,
        trim: true,
        required: true
      },
      openid: {
        string: true,
        trim: true,
        required: true
      },
    };
    const valid = this.validate(rules);
    // 校验参数数据结构是否正确
    if (!valid) {
      return this.fail(1000, this.validateErrors);
    }
  }
};