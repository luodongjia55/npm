const BaseModel = require('./base');

module.exports = class extends BaseModel {
  get tableName() {
    return 'version';
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
      version: {
        type: 'varchar(255)'
      },
      status: {
        type: 'int(1)'
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
    };
  }
};