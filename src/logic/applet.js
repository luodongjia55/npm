
const base = require('./base')

module.exports = class extends base  {
  async block_postAction() {
    if (!this.isPost) {
      return this.fail(1000, 'method is must be post');
    }
  }   
};

