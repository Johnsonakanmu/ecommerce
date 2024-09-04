'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('orderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      productId: {
        type: DataTypes.INTEGER,  
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,  
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,  
        defaultValue: 1,  
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),  
        allowNull: false,  
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),  
        allowNull: false,  
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('orderItems');
  }
};