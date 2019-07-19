
import {
  think
} from 'thinkjs';


module.exports = class extends think.Controller {
  async block_postAction() {
    return this.success();
  }
};