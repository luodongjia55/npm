const BaseModel = require('./base');

module.exports = class extends BaseModel {
  get tableName() {
    return 'billion_order';
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
      wx_order_id: {
        type: 'varchar(255)'
      },
      order_id: {
        type: 'varchar(255)'
      },
      user_id: {
        type: 'varchar(36)'
      },
      name: {
        type: 'varchar(255)'
      },
      price: {
        type: 'int(11)'
      },
      interest: {
        type: 'varchar(255)'
      },
      user_name: {
        type: 'varchar(255)'
      },
      user_phone: {
        type: 'varchar(255)'
      },
      due_time: {
        type: 'datetime',
      },
      create_time: {
        type: 'datetime',
        default: () => think.datetime(Date.now())
      },
      update_time: {
        type: 'datetime',
        default: () => think.datetime(Date.now())
      },
      is_delete: {
        type: 'int(1)',
        default: 0
      },
      order_status: {
        type: 'int(11)',
        default: 100
      },
    };
  }
};