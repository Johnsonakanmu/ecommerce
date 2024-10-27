'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate({ User, Product, CartItem, OrderItem }) {
      // Define associations
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems' }); // Cart and CartItem association
      this.hasMany(OrderItem, { foreignKey: 'cartId', as: 'orderItems', onDelete: 'CASCADE' });

      // Cart belongs to many products through CartItem
      this.belongsToMany(Product, {
        through: CartItem, // Use CartItem as the join table
        foreignKey: 'cartId',
        otherKey: 'productId',
        as: 'products',
      });
    }

    // Static method to update userId based on sessionId
    static async updateUserIdBySessionId(sessionId, userId) {
      try {
        const [updatedRows] = await this.update(
          { userId }, // New userId
          { where: { sessionId } } // Find by sessionId
        );
        return updatedRows; // Number of updated rows
      } catch (error) {
        console.error('Error updating Cart with userId:', error);
        throw error;
      }
    }

    // Method to get items by sessionId
    static async getItemsBySessionId(sessionId) {
      const cart = await this.findOne({ where: { sessionId } });
      if (!cart) return []; // Return empty array if no cart found
      
      // Ensure CartItem is correctly referenced
      return await this.sequelize.models.CartItem.findAll({ where: { cartId: cart.id } });
    }
  }

  Cart.init(
    {
      userId: {
        type: DataTypes.INTEGER, // Should match the type of User's primary key
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      sessionId: {
        type: DataTypes.STRING, // Unique session ID for guest users
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'carts',
      modelName: 'Cart',
    }
  );

  return Cart;
};
