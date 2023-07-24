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
    role: DataTypes.ENUM('Mentor', 'Konselor'),
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
  Mentor.associate = function (models) {
    Mentor.belongsTo(models.User, {
      foreignKey: 'idUser',
      as: 'User'
    }),
    Mentor.hasMany(models.ScheduleMentor, {
      foreignKey: 'id_mentor',
      as: 'ScheduleMentor'
    })
  }
  return Mentor;
};