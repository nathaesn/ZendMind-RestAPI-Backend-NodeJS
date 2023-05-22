'use strict';
const { body } = require('express-validator');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: DataTypes.STRING,
    subtitle: DataTypes.TEXT,
    viewsCount: DataTypes.INTEGER,
    bannerURL: DataTypes.TEXT,
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};

