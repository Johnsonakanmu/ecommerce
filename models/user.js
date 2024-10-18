'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product,Cart, Order, OrderItem, ShippingDetail}) {
      // define association here
      this.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' }); // Updated association
      // User has many Products
      this.hasMany(Product, { foreignKey: 'userId', as: 'products' });
      this.hasMany(Product, { foreignKey: 'createdBy', as: 'createdProducts' }); // Add this line to track products created by this user
      this.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });

  // One User can have multiple OrderItems (e.g., in multiple orders)
  this.hasMany(OrderItem, { foreignKey: 'userId', as: 'orderItems', onDelete: 'CASCADE' });
   this.hasMany(ShippingDetail, { foreignKey: 'userId', as: 'shippingDetails' });


    }
  }
  User.init({
    fullName: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {  // Change from role to isAdmin
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false // Default is not an admin
    },
 }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};