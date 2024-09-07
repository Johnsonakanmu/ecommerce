"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productCategories: {
        type: DataTypes.ENUM("Cloths", "Jersey", "Sportswear"), // ENUM data type
        allowNull: true, // Categories are usually required
      },
      productBrand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Men", "Women", "Other"), // ENUM for gender categories
        allowNull: true,
      },
      size: {
        type: DataTypes.ENUM("XS", "S", "M", "XL", "XXL", "3XL"), // ENUM for sizes
        allowNull: true,
      },
      color: {
        type: DataTypes.ENUM(
          "Dark",
          "Yellow",
          "White",
          "Red",
          "Green",
          "Blue",
          "Sky",
          "Gray"
        ), // ENUM for colors
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tagNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      productStock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      productPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      productDiscount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productTax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      soldAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("products");
  },
};
