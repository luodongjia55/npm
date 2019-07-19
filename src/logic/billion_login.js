import {
  think
} from 'thinkjs';
module.exports = class extends think.Logic {
  async loginAction() {
    this.allowMethods = 'post';

    const rules = {
      code: {
        string: true,
        trim: true
      },
      encryptedData: {
        string: true,
        trim: true
      },
      iv: {
        string: true,
        trim: true
      },
      status: {
        string: true,
        trim: true,
        required: true
      }
    };
    const valid = this.validate(rules);
    // 校验参数数据结构是否正确
    if (!valid) {
      return this.fail(1000, this.validateErrors);
    }
  }
  async checkAction() {
    this.allowMethods = 'get';

    const rules = {
      v: {
        string: true,
        trim: true,
        required: true
      }
    };
    const valid = this.validate(rules);
    // 校验参数数据结构是否正确
    if (!valid) {
      return this.fail(1000, this.validateErrors);
    }
  }
};