'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('products', 'createdBy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {  // Foreign key for User
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: true,  // Typically, a product must have a name
      },
      productCategories: {
        type: DataTypes.ENUM('Jersey', 'Clothes', 'Other'), // ENUM for gender categories
        allowNull: true,
      },
      productBrand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
      gender: {
        type: DataTypes.ENUM('Men', 'Women', 'Other'), // ENUM for gender categories
        allowNull: true,
      },
      size: {
        type: DataTypes.ENUM('XS', 'S', 'M', 'XL', 'XXL', '3XL'), // ENUM for sizes
        allowNull: true,
      },
      color: {
        type: DataTypes.ENUM('Dark', 'Yellow', 'White', 'Red', 'Green', 'Blue', 'Sky', 'Gray'), // ENUM for colors
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT, 
        allowNull: true,
      },
      tagNumber: {
        type: DataTypes.INTEGER,
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
      discount: {
        type: DataTypes.FLOAT, 
        allowNull: true,
      },
      tax: {
        type: DataTypes.FLOAT, 
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      soldAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      sellingPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      discountType: {
        type: DataTypes.ENUM('Percentage', 'Fixed'), 
        allowNull: true,
      },
      isDiscount: {
        type: DataTypes.BOOLEAN,  // This will create a TINYINT(1) column in MySQL
        allowNull: true,
        defaultValue: true,      // Set a default value of false
      },
      createdBy: {
        type: DataTypes.INTEGER, // or Sequelize.STRING depending on your user ID type
        allowNull: true, // Ensures that createdBy cannot be null
        references: {
          model: 'Users', // name of the target model
          key: 'id',      // key in the target model
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
    await queryInterface.dropTable('products', 'createdBy');
  }
};