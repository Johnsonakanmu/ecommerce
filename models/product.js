'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Cart, CartItem, OrderItem}) {

      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

       this.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

      // Product belongs to many carts through CartItem
      this.belongsToMany(Cart, {
        through: CartItem,   // Use CartItem as the join table
        foreignKey: 'productId',
        otherKey: 'cartId',
        as: 'carts'
      });

    }
  }
  Product.init({
    userId: {  // Foreign key for User
      type: DataTypes.INTEGER,
      allowNull: false,
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
      defaultValue: false,      // Set a default value of false
    },
    createdBy: {
      type: DataTypes.INTEGER, // or Sequelize.STRING depending on your user ID type
      allowNull: false, // Ensures that createdBy cannot be null
      references: {
        model: 'Users', // name of the target model
        key: 'id',      // key in the target model
      }
    }
  }, {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
  });
  return Product;
};