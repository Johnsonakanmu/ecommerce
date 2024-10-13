'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProduct extends Model {
    static associate({User, Product}) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Product, { foreignKey: 'productId' });
      
    }
  }

  UserProduct.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Use the table name
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'products', // Use the table name
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'userProducts',
    modelName: 'UserProduct',
  });

  return UserProduct;
};
