'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Product, CartItem}) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems'}); // Cart and CartItem association

      // Cart belongs to many products through CartItem
      this.belongsToMany(Product, {
        through: CartItem,   // Use CartItem as the join table
        foreignKey: 'cartId',
        otherKey: 'productId',
        as: 'products'
      });
    }
  }
  Cart.init({
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
    tableName: 'carts',
    modelName: 'Cart',
  });
  return Cart;
};