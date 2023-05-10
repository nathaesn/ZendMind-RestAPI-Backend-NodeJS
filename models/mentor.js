'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mentor.init({
    idUser: DataTypes.INTEGER,
    username: DataTypes.STRING,
    fee: DataTypes.INTEGER,
    incomeNow: DataTypes.INTEGER,
    specialist: DataTypes.STRING,
    about: DataTypes.TEXT,
    status: DataTypes.ENUM('Active','NonActive'),
  }, {
    sequelize,
    modelName: 'Mentor',
  });
  return Mentor;
};