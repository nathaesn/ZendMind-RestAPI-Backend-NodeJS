'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResponseAi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResponseAi.init({
    key: DataTypes.STRING,
    response: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('response');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('response', JSON.stringify(value));
      },
    } 
  }, {
    sequelize,
    modelName: 'ResponseAi',
  });
  return ResponseAi;
};