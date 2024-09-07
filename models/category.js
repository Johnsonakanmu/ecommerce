'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product, User}) {
      this.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      // define association here
    }
  }
  Category.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: true,  // Typically, a product must have a name
    },
    description: {
      type: DataTypes.TEXT, 
      allowNull: true,
    },
    userId: {  // Foreign key for the associated User
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // The User table
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
  });
  return Category;
};