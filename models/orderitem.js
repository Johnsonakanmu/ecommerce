'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate({ Order, Product }) {
      // Define association here
      OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
      OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  OrderItem.init({
    productId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,  
      defaultValue: 1,  
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),  
      allowNull: false,  
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),  
      allowNull: false,  
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'orderItems',  
    modelName: 'OrderItem',
  });

  return OrderItem;
};
