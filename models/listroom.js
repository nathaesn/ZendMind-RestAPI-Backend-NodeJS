'use strict';
const { response } = require('express');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListRoom.init({
    id_user: DataTypes.INTEGER,
    id_SecondUser: DataTypes.INTEGER,
    id_lastChat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListRoom',
  });
  ListRoom.associate = function (models) {
    ListRoom.belongsTo(models.User, {
      foreignKey: 'id_SecondUser',
      as: 'SecondUser'
    }),
    ListRoom.belongsTo(models.Message, {
      foreignKey: 'id_lastChat',
      as: 'Message'
    })
  }
  return ListRoom;
};