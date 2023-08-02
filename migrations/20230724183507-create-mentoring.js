'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mentorings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      id_mentor: {
        type: Sequelize.INTEGER
      },
      fee: {
        type: Sequelize.INTEGER
      },
      date_mentoring: {
        type: Sequelize.DATEONLY
      },
      time_mentoring: {
        type: Sequelize.TIME
      },
      notes: {
        type: Sequelize.TEXT
      },
      urlTrx: {
        type: Sequelize.TEXT
      },
      idTRx: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('WaitingP', 'PCancelled','PFailed','Pending','Finished','Cancelled')
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
    await queryInterface.dropTable('Mentorings');
  }
};