'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate({ OrderCart }) {
      // Correct association for OrderItem
     this.hasMany(OrderCart, { foreignKey: 'productId', as: 'orderCarts' });
    }
  }

  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,  // Typically, a product must have a name
    },
    productCategories: {
      type: DataTypes.ENUM('Cloths', 'Jersey', 'Sportswear'), // ENUM data type
      allowNull: false,  // Categories are usually required
    },
    productBrand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productWeight: {
      type: DataTypes.STRING, // Use STRING for weights that might include units (e.g., '2kg')
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
    productStock: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 0,
    },
    tag: {
      type: DataTypes.ENUM('Fashion', 'Clothes', 'Jersey'),
      allowNull: true,
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,  
    },
    productDiscount: {
      type: DataTypes.FLOAT, 
      allowNull: true,
    },
    productTax: {
      type: DataTypes.FLOAT, 
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    soldAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
  });

  return Product;
};
