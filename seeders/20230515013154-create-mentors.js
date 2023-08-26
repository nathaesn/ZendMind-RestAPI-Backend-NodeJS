'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Mentors', [
      {
        idUser: 4,
        role: 'Mentor',
        username: 'Dika',
        fee: 100000,
        incomeNow: 0,
        specialist: 'Anxiety',
        about: 'Saya adalah seorang psikolog smk rus',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        idUser: 5,
        role: 'Mentor',
        username: 'Bimo',
        fee: 0,
        incomeNow: 0,
        specialist: 'Depression',
        about: 'Langsung order aja ya, free kok',
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
