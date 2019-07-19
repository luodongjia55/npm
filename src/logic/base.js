const userService = think.service('billion_user');

module.exports = class extends think.Logic {
  async __before() {
    const token = this.header('token');
    if (think.isEmpty(token)) {
      this.ctx.status = 401;
      return this.fail(401,'请登录');
    }
    const user = await userService.getUserByToken(token);
    if (think.isEmpty(user.id)) {
      this.ctx.status = 401;
      return this.fail(401,'登录鉴权已过期，请重新登录');
    }
    this.ctx.user = user;
  }
};