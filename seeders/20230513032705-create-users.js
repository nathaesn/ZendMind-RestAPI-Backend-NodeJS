'use strict';
const bcryptjs = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = bcryptjs.hashSync("password", 10)
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin Zendmind',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        verifyToken: "",
        isVerify: "true",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Michiko',
        email: 'michiko@example.com',
        password: hashedPassword,
        role: 'user',
        verifyToken: "",
        isVerify: "true",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Zendmind',
        email: 'igne.team@gmail.com',
        password: hashedPassword,
        role: 'user',
        verifyToken: "",
        isVerify: "false",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kazena',
        email: 'kazena@example.com',
        password: hashedPassword,
        role: 'mentor',
        verifyToken: "",
        isVerify: "true",
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
