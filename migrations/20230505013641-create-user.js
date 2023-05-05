'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      pin:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      imgProfileURL: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING
      },
      role:{
        type: Sequelize.ENUM('admin', 'mentor', 'user'),
        defaultValue: 'user'
      },
      isVerify:{
        type: Sequelize.ENUM('active', 'none'),
        defaultValue: 'none'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};