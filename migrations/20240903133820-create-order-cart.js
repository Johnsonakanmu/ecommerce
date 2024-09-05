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
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      productId: {
        type: DataTypes.INTEGER,  
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
      orderId: {  // This foreign key connects the OrderCart to Order
        type: DataTypes.INTEGER,
        allowNull: true, // It can be null initially if the cart hasn't been converted into an order
        references: {
          model: 'orders',
          key: 'id'
        }
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