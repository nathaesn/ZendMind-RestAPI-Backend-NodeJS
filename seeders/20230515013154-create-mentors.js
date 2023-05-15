'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Mentors', [
      {
        idUser: 4,
        role: 'Mentor',
        username: 'Mentor1',
        fee: 100000,
        incomeNow: 100000,
        specialist: 'Anxiety',
        about: 'Saya adalah seorang psikolog yang sudah berpengalaman selama 10 tahun',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        idUser: 5,
        role: 'Mentor',
        username: 'Mentor2',
        fee: 100000,
        incomeNow: 100000,
        specialist: 'Depression',
        about: 'Saya adalah seorang psikolog yang sudah berpengalaman selama 10 tahun',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
