'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Articles', [
      {
        title: 'Artikel Test 1',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
        viewsCount: 12,
        content: '',
        bannerURL: 'https://npr.brightspotcdn.com/dims4/default/faf66be/2147483647/strip/true/crop/1024x719+0+0/resize/880x618!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkstx%2Ffiles%2F201808%2FMentalHealth_Flickr.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Artikel Test 2',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
        viewsCount: 12,
        content: '',
        bannerURL: 'https://npr.brightspotcdn.com/dims4/default/faf66be/2147483647/strip/true/crop/1024x719+0+0/resize/880x618!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkstx%2Ffiles%2F201808%2FMentalHealth_Flickr.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Artikel Test 3',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus. Nullam eget nunc eget risus suscipit ultrices. Sed vitae urna nec elit ultrices rhoncus.',
        viewsCount: 12,
        content: '',
        bannerURL: 'https://npr.brightspotcdn.com/dims4/default/faf66be/2147483647/strip/true/crop/1024x719+0+0/resize/880x618!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkstx%2Ffiles%2F201808%2FMentalHealth_Flickr.jpg',
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
