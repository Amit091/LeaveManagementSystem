'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await getPerson(data){
      return await queryInterface.bulkInsert('Users', [{
        name: data.name,
        number: number,
        description: description,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    }

  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', null, {});
  }
};
