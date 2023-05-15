'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mentors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM('Konselor', 'Mentor'),
      },
      idUser: {
        unique: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      fee:{
        type: Sequelize.INTEGER
      },
      incomeNow:{
        type: Sequelize.INTEGER
      },
      specialist:{
        type: Sequelize.STRING
      },
      about:{
        type: Sequelize.TEXT
      },
      status:{
        type: Sequelize.ENUM('Active','NonActive')
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
    await queryInterface.dropTable('Mentors');
  }
};