'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      shippingDetailId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: false,
        references: {
          model: 'shippingDetails',
          key: 'id'
        },
      },
      order_no: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
      },
      status: { 
        type: DataTypes.STRING, 
        defaultValue: 'pending' 
      },
      amount: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
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
    await queryInterface.dropTable('orders');
  }
};