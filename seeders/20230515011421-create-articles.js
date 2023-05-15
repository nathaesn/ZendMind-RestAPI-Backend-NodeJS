'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Articles', [
      {
        title: 'Artikel Test 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Artikel Test 2',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Artikel Test 3',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
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
