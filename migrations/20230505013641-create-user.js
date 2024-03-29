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
      gender:{
        type: Sequelize.ENUM('Laki-Laki', 'Perempuan'),
        allowNull: true
      },
      isVerify:{
        type: Sequelize.ENUM('true', 'false'),
        defaultValue: 'false'
      },
      verifyToken:{
        type: Sequelize.TEXT
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