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
    static associate({Category, Product, Order}) {
      this.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
      this.hasOne(Order, { foreignKey: 'userId', as: 'order' }); // Updated association

      // User has many Products
      this.hasMany(Product, { foreignKey: 'userId', as: 'products' });
    }
  }
  User.init({
    sessionId:{
      type: DataTypes.INTEGER,
      allowNull:false
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
      unique: false,  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
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
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isactive: {
      type: DataTypes.ENUM('true', 'false'), 
      allowNull: true,
      defaultValue: 'true', 
  },
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};