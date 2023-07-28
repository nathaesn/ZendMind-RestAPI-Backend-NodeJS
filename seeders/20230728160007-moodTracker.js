'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Function to generate random moods
    function getRandomMood() {
      const moods = ['happy', 'normal', 'sad', 'angry'];
      const randomIndex = Math.floor(Math.random() * moods.length);
      return moods[randomIndex];
    }

    // Utility function to get date for a specific month and day
    function getDateForMonthAndDay(month, day) {
      const year = 2023; // Change the year if needed
      return new Date(year, month - 1, day);
    }

    const months = 7; // January to June
    const daysInMonth = [31, 28, 31, 30, 31, 30, 28]; // Number of days in each month
    const idUser = 2; // User ID (update it with the appropriate ID)

    for (let month = 1; month <= months; month++) {
      for (let day = 1; day <= daysInMonth[month - 1]; day++) {
        await queryInterface.bulkInsert('Moods', [
          {
            idUser,
            monthYear: `2023-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`,
            mood: getRandomMood(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here if needed.
  },
};
