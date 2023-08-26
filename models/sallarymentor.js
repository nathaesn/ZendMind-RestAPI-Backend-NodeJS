'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SallaryMentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SallaryMentor.init({
    id_user: DataTypes.INTEGER,
    norek: DataTypes.TEXT,
    type: DataTypes.TEXT,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SallaryMentor',
  });
  return SallaryMentor;
};