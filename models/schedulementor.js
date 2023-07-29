'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleMentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduleMentor.init({
    id_mentor: DataTypes.INTEGER,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'ScheduleMentor',
  });
  ScheduleMentor.associate = function (models) {
    ScheduleMentor.belongsTo(models.Mentor, {
      foreignKey: 'id_mentor',
      as: 'ScheduleMentor'
    }),
    ScheduleMentor.hasMany(models.TimeSchedule, {
      foreignKey: 'id_schedule',
      as: 'TimeSchedule'
    })
  }
  return ScheduleMentor;
};