'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mood.init({
    mood: {
      type: DataTypes.ENUM('happy', 'normal', 'sad', 'angry'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Mood',
  });
  return Mood;
};