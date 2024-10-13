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
      userId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      orderId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
      },
      cartId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: true,  // Typically, a product must have a name
      },
      size: {
        type: DataTypes.ENUM('XS', 'S', 'M', 'XL', 'XXL', '3XL'), // ENUM for sizes
        allowNull: true,
      },
      color: {
        type: DataTypes.ENUM('Dark', 'Yellow', 'White', 'Red', 'Green', 'Blue', 'Sky', 'Gray'), // ENUM for colors
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        defaultValue: 0,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,  
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      tax: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.FLOAT, // Add this field to store discount value
        allowNull: true, // If there's no discount, this can be null
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