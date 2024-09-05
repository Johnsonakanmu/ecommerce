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
    static associate({User, OrderCart}) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
     this.hasMany(OrderCart, { foreignKey: 'orderId', as: 'orderCarts' });

    }
  }
  Order.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // orderCartId: { 
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    firstname: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,  
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,   
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipping_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
  });
  return Order;
};