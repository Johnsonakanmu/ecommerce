'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cart, Product, User}) {
      // define association here
      this.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
      this.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    }
  }
  CartItem.init({
    cartId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'carts',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER, // Should match the type of User's primary key
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
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
    } ,
    discount: {
      type: DataTypes.FLOAT, // Add this field to store discount value
      allowNull: true, // If there's no discount, this can be null
    },
  }, {
    sequelize,
    tableName: 'cartItems',
    modelName: 'CartItem',
  });
  return CartItem;
};