'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Product, Order}) {
      // define association here
      this.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Order, { foreignKey: 'orderId',  as: 'order'
      });
    }
  }
  OrderCart.init({
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
    }
  }, {
    sequelize,
    tableName: "orderCarts",
    modelName: 'OrderCart',
  });
  return OrderCart;
};