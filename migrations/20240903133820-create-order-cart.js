'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('orderCarts', {
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
      productName: {
        type: DataTypes.STRING,
        allowNull: false,  // Typically, a product must have a name
      },
      size: {
        type: DataTypes.ENUM('XS', 'S', 'M', 'XL', 'XXL', '3XL'), // ENUM for sizes
        allowNull: true,
      },
      color: {
        type: DataTypes.ENUM('Dark', 'Yellow', 'White', 'Red', 'Green', 'Blue', 'Sky', 'Gray'), // ENUM for colors
        allowNull: true,
      },
      productStock: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        defaultValue: 0,
      },
      productPrice: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,  
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),  
        allowNull: false,  
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,  
        },
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
    await queryInterface.dropTable('orderCarts');
  }
};