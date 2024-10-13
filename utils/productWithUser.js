const { UserProducts } = require('../models'); // Adjust the path to your models

async function associateProductWithUser(userId, productId) {
  try {
    // Check if the association already exists
    const existingAssociation = await UserProducts.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingAssociation) {
      console.log(`Association already exists for user ${userId} and product ${productId}`);
      return; // No need to create a new association
    }

    // Create a new association if it doesn't exist
    await UserProducts.create({
      userId,
      productId,
    });

    console.log(`Successfully associated user ${userId} with product ${productId}`);
  } catch (error) {
    console.error("Error associating product with user:", error);
    throw new Error('Failed to associate product with user');
  }
}

module.exports = {associateProductWithUser}