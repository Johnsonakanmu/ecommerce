'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, OrderItem, ShippingDetail}) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
      this.belongsTo(ShippingDetail, { foreignKey: 'shippingDetailId', as: 'shippingDetails' });
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER, // Should match the type of User's primary key
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    shippingDetailId: {
      type: DataTypes.INTEGER, // Should match the type of User's primary key
      allowNull: false,
      references: {
        model: 'shippingDetails',
        key: 'id'
      },
    },
    order_no: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    status: { 
      type: DataTypes.STRING, 
      defaultValue: 'pending' 
    },
    amount: { 
      type: DataTypes.FLOAT, 
      allowNull: false 
    },
  }, {
    tableName: 'orders',
    sequelize,
    modelName: 'Order',
  });
  return Order;
};