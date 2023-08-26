'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RekeningMentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RekeningMentor.init({
    id_user: DataTypes.INTEGER,
    norek: DataTypes.TEXT,
    type: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RekeningMentor',
  });
  return RekeningMentor;
};