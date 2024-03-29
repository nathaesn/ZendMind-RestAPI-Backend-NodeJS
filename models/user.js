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
    imgProfileURL:{
      type: DataTypes.STRING,
    },
    name: DataTypes.STRING,
    verifyToken: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'mentor', 'user'),
    isVerify: DataTypes.ENUM('true', 'false'),
    gender: DataTypes.ENUM('Laki-Laki', 'Perempuan')

  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = function (models) {
    User.hasOne(models.Mentor, {
      foreignKey: 'idUser',
      as: 'MentorProfile'
    }),
    User.hasMany(models.RekeningMentor, {
      foreignKey: 'id_user',
      as: 'RekeningMentor'
    })
  }
  return User;
};