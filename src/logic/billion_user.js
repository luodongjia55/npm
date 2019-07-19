const base = require('./base')
module.exports = class extends base {
  async my_infoAction() {
    if (!this.isGet) {
      return this.fail(1000, 'method is must be get');
    }
  }   
};