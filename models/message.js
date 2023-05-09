'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init({
    userId: DataTypes.INTEGER,
    to_userId: DataTypes.INTEGER,
    roomID: DataTypes.TEXT,
    message: DataTypes.STRING,
    type: DataTypes.ENUM('Text', 'Img', 'Media'),
    status: DataTypes.ENUM('New', 'Seen')
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};