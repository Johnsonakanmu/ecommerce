'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate({ User, Category, Order,  }) {
      this.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      // Many-to-many relationship with Order through orderCart
      this.belongsToMany(Order, { through: 'orderCart', as: 'orders' });

      // Many-to-many relationship with Order through orderItem
      this.belongsToMany(Order, { through: 'orderItem', as: 'orderItems' });

    }
  }

  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: true,  // Typically, a product must have a name
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
    productStock: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      defaultValue: 0,
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: true,  
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
      allowNull: true,
      defaultValue: 0
    },
    categoryId: {  // Foreign key for Category
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',  // Name of the Category table
        key: 'id'
      }
    },
    userId: {  // Foreign key for User
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
  });

  return Product;
};
