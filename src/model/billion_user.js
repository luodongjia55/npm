const BaseModel = require('./base');

module.exports = class extends BaseModel {
  get tableName() {
    return 'billion_user';
  }
  get schema() {
    return {
      id: {
        type: 'varchar(36)',
        default: () => think.uuid('v4'),
        primary: true,
        unique: true,
        readonly: true
      },
      phone_num: {
        type: 'varchar(36)'
      },
      is_deleted: {
        type: 'int(1)',
        default: 0
      },
      create_time: {
        type: 'datetime',
        default: () => think.datetime(Date.now())
      },
      update_time: {
        type: 'datetime',
        default: () => think.datetime(Date.now())
      },
      last_login_time: {
        type: 'datetime',
        default: () => think.datetime(Date.now())
      },
      token: {
        type: 'varchar(255)'
      }
    };
  }
};