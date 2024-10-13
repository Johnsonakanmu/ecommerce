const { Cart, CartItem, Product } = require('../models'); // Adjust path based on your project structure
const { Op } = require('sequelize');

async function calculateCartTotals(user_or_session_id) {
  const cart = await Cart.findOne({
    where: {
      [Op.or]: [
        { user_or_session_id },  
        { user_or_session_id } 
      ]
    },
    include: [
      {
        model: CartItem,
        as: 'cartItems',
        attributes: ['id', 'quantity', 'price', 'discount', 'tax'],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'productName', 'imageUrl', 'size', 'color'],
          },
        ],
      },
    ],
  });
  
    let totalDiscount = 0;
    let totalTax = 0;
    let subtotal = 0; // Ensure this is a number
    let items = [];
  
    console.log('Cart:', cart); // Debugging line
  
    if (cart && cart.cartItems && Array.isArray(cart.cartItems) && cart.cartItems.length > 0) {
      items = cart.cartItems.map((item) => {
        const itemPrice = item.price || 0; // Default to 0 if undefined
        const itemDiscount = item.discount || 0; // Default to 0 if undefined
        const itemTax = item.tax || 0; // Default to 0 if undefined
  
        console.log(`Item Price: ${itemPrice}, Item Discount: ${itemDiscount}, Item Tax: ${itemTax}, Quantity: ${item.quantity}`);
  
        const individualTotal = (itemPrice - itemDiscount + itemTax) * item.quantity;
        subtotal += individualTotal; // Accumulate the subtotal
  
        totalDiscount += itemDiscount * item.quantity;
        totalTax += itemTax * item.quantity;
  
        return {
          ...item.toJSON(),
          individualTotal: individualTotal.toFixed(2),
        };
      });
    }
  
    // Ensure subtotal is a valid number before using toFixed
    if (typeof subtotal !== 'number' || isNaN(subtotal)) {
      console.error('Subtotal is not a valid number:', subtotal); // Log the error
      subtotal = 0; // Reset subtotal to 0 if invalid
    }
  
    
  
    const total = subtotal;
  
    return { 
      subtotal,
      totalDiscount, 
      totalTax, 
      total, 
      items 
    };
  }
  
  
  

// Export the utility function
module.exports = {
  calculateCartTotals,
};