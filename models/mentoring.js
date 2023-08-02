'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentoring extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mentoring.init({
    id_user: DataTypes.INTEGER,
    id_mentor: DataTypes.INTEGER,
    fee: DataTypes.INTEGER,
    date_mentoring: DataTypes.DATEONLY,
    time_mentoring: DataTypes.TIME,
    notes: DataTypes.TEXT,
    urlTrx: DataTypes.TEXT,
    idTRx: DataTypes.STRING,
    status: DataTypes.ENUM('WaitingP', 'PCancelled','PFailed','Pending','Finished','Cancelled')
  }, {
    sequelize,
    modelName: 'Mentoring',
  });
  Mentoring.associate = function (models) {
    Mentoring.belongsTo(models.Mentor, {
      foreignKey: 'id_mentor',
      as: 'Mentor'
    })
    Mentoring.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'User'
    })
  }
  return Mentoring;
};