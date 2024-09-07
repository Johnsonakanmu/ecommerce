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
    static associate({User, Product}) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });

      // Many-to-many relationship with Product through orderCart
      this.belongsToMany(Product, { through: 'orderCart', as: 'products' });

      // Many-to-many relationship with Product through orderItem
      this.belongsToMany(Product, { through: 'orderItem', as: 'orderItems' });
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER, // Should match the type of User's primary key
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    firstname: { 
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,   
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shipping_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
  });
  return Order;
};