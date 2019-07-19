module.exports = class extends think.Model {
    beforeUpdate(data){
      data.update_time = think.datetime(Date.now());
      return data;
    }
  }