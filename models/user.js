'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    pin: DataTypes.INTEGER,
    imgProfileURL:{
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('imgProfileURL');
        return rawValue ? process.env.BASE_URL + rawValue : null
      }
    },
    name: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'mentor', 'user'),
    isVerify: DataTypes.ENUM('active', 'none'),

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};