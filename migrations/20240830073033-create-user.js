'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type:  DataTypes.INTEGER
      },
      firstname: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isactive: {
        type: DataTypes.ENUM('true', 'false'), 
        allowNull: false,
        defaultValue: 'true', 
    },
      createdAt: {
        allowNull: false,
        type:  DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type:  DataTypes.DATE
      }
    });
  },
  async down(queryInterface,  DataTypes) {
    await queryInterface.dropTable('users');
  }
};