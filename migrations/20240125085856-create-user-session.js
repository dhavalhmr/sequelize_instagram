'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session', {
      sid: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      sess: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      expire: {
        type: Sequelize.DATE(6),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('session', ['expire'], { name: 'IDX_session_expire' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('session');
  }
};
