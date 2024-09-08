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
      firstName: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,  
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isactive: {
        type: DataTypes.ENUM('true', 'false'), 
        allowNull: true,
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