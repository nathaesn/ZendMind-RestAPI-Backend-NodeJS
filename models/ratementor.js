'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RateMentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RateMentor.init({
    id_user: DataTypes.INTEGER,
    id_mentor: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    rate: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'RateMentor',
  });
  RateMentor.associate = function (models) {
    RateMentor.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'User'
    })
  }
  return RateMentor;
};