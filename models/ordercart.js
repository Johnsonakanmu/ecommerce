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
    static associate({Order, Product}) {
      // define association here
      this.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
      this.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  OrderCart.init({
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
  }, {
    sequelize,
    tableName: "orderCarts",
    modelName: 'OrderCart',
  });
  return OrderCart;
};