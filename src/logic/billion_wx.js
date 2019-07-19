
import {
  think
} from 'thinkjs';
module.exports = class extends think.Logic {
  async get_openidAction() {
    if (!this.isGet) {
      return this.fail(1000, 'method is must be get');
    }
    const rules = {
      code: {
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
  async update_versionAction() {
    if (!this.isPost) {
      return this.fail(1000, 'method is must be post');
    }
    const rules = {
      v: {
        string: true,
        trim: true,
        required: true
      },
      status: {
        int: true,
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