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
    static associate({User, Product, CartItem, OrderItem}) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems'}); // Cart and CartItem association
      this.hasMany(OrderItem, { foreignKey: 'cartId', as: 'orderItems', onDelete: 'CASCADE' });

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
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.STRING,  // Unique session ID for guest users
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'carts',
    modelName: 'Cart',
  });
  return Cart;
};