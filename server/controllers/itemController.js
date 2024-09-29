const {Product, Cart, CartItem, User, } = require('../../models/index');
const { Sequelize } = require('sequelize'); 

exports.itemsList = async (req, res, next) => {
    try {
        // Extract page and limit from query parameters, set defaults
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page

        // Calculate the offset (number of products to skip)
        const offset = (page - 1) * limit;

        // Fetch the total count of products and the products for the current page
        const productCount = await Product.count();
        const products = await Product.findAll({
          include: [
            {
              model: User,      
              as: 'user',      
            }
        ],
            limit: limit, // Number of products to fetch
            offset: offset // Number of products to skip
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(productCount / limit);

        // Render the 'index' view with the fetched products and pagination data
        res.render('items/item_lists', { 
            title: "Home Page | Order Your Jersey", 
            showSidebar: false,
            productCount: productCount.toLocaleString(),  
            products: products,
            currentPage: page,
            totalPages: totalPages,
            limit: limit
        });
    } catch (err) {
        // Handle any errors by sending a JSON response with the error message
        res.json({ message: err.message });
    }
};

exports.searchItem = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';  

        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch products based on search term
        const products = await Product.findAll({
            where: {
                productName: {
                    [Sequelize.Op.like]: `%${searchTerm}%`
                }
            },
            limit: limit,
            offset: (currentPage - 1) * limit
        });

        const productCount = products.length;
        const totalPages = Math.ceil(productCount / limit);

        // Render the search results and pass searchTerm to the template
        res.render('items/item_lists', {
            title: 'Product Search Results',
            showSidebar: false,
            products: products,
            searchTerm: searchTerm,  // Make sure this line is present
            productCount: productCount.toLocaleString(),
            currentPage: currentPage,
            totalPages: totalPages,
            limit: limit
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.postCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.id;
  const quantity = 1; // Default quantity to add

  try {
    // Step 1: Find or Create the Cart for the Current User
    let cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await Cart.create({ userId: userId });
    }

    // Step 2: Fetch the Product from the Database
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("Product Details:", product); // Debug the product object

    // Step 3: Calculate Price, Discount, and Tax
    const originalPrice = parseFloat(product.price); // Get original price
    const discount = parseFloat(product.discount || 0); // Retrieve the discount from the Product model
    const discountedPrice = originalPrice - discount; // Calculate the discounted price
    const tax = product.tax || 0; // Ensure tax is defined, default to 0

    // Step 4: Check if Product Already Exists in the Cart
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });
    if (cartItem) {
      // Update the existing item in the cart
      cartItem.quantity += quantity;
      cartItem.price = originalPrice; // Set the original price
      cartItem.discount = discount; // Set discount from the Product model
      cartItem.amount = discountedPrice * cartItem.quantity; // Calculate based on the discounted price
      cartItem.tax = tax; // Set the tax value
      await cartItem.save();
    } else {
      // Create a new item in the cart
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        imageUrl: product.imageUrl,
        productName: product.productName,
        size: product.size,
        color: product.color,
        quantity,
        price: originalPrice, // Store original price
        discount, // Store discount value from Product model
        amount: discountedPrice * quantity, // Store total amount based on the discounted price
        tax, // Pass the correct tax value
      });
    }

    // Step 5: Update Cart Summary (Total Quantity and Price)
    cart.totalQuantity = (cart.totalQuantity || 0) + quantity;
    cart.totalPrice = (cart.totalPrice || 0) + discountedPrice * quantity; // Reflect discounted price in total
    await cart.save();

    // Step 6: Redirect to Cart Page
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


exports.updateCartItemQuantity = async (req, res, next) => {
  const cartItemId = req.params.id;  // Make sure this is the cart item ID, not product ID
  const newQuantity = req.body.quantity;

  try {
    // Find the cart item by cartItemId, not productId
    const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update the quantity if found
    cartItem.quantity = newQuantity;
    cartItem.amount = cartItem.price * newQuantity; 
    await cartItem.save();

    // Optionally redirect or respond with a success message
    res.redirect('/cart');  // or res.json({ message: 'Quantity updated successfully' });
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    res.status(500).json({ message: 'Error updating cart item quantity' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Fetch the cart and its associated items and products
    const cart = await Cart.findOne({
      where: { userId },
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
    let subtotal = 0; // Subtotal for all items
    let items = [];

    // Step 4: Calculate the estimated delivery date
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5); // Add 5 days for estimated delivery

    // Format the date to a readable format (e.g., "25 April, 2024")
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = estimatedDeliveryDate.toLocaleDateString('en-US', options);

    // Step 2: Check if the cart has items and assign to `items` array
    if (cart && Array.isArray(cart.cartItems)) {
      items = cart.cartItems;

      // Step 3: Calculate totals for individual items and update subtotal
      items = items.map((item) => {
        const itemPrice = item.price || 0;
        const itemDiscount = item.discount || 0;
        const itemTax = item.tax || 0;

        // Calculate the individual total for each item: (price - discount + tax) * quantity
        const individualTotal = (itemPrice - itemDiscount + itemTax) * item.quantity;

        // Add the individual total to subtotal
        subtotal += individualTotal;

        // Accumulate discount and tax
        totalDiscount += itemDiscount * item.quantity;
        totalTax += itemTax * item.quantity;

        return {
          ...item.toJSON(), // Keep the rest of the item properties
          individualTotal: individualTotal.toFixed(2), // Add individual total to each item
        };
      });
    }

    // Step 4: Calculate the final total price (Subtotal - Discount + Tax)
    const total = subtotal;

    // Step 5: Render the view with items, subtotal, total price, total discount, and tax
    res.render('items/cart', {
      showSidebar: false,
      items,
      subtotal: subtotal.toFixed(2), // Pass the calculated subtotal
      totalDiscount: totalDiscount.toFixed(2), // Total discount for display
      totalTax: totalTax.toFixed(2), // Total tax for display
      total: total.toFixed(2), // Grand total amount
            estimatedDeliveryDate: formattedDate,

    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const cartItemId = req.params.id; // Get cart item ID from URL parameters

  try {
      // Find the cart item by ID
      const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

      if (!cartItem) {
          req.session.message = {
              type: 'danger',
              message: 'Cart item not found'
          };
          return res.redirect('/cart'); // Redirect to cart page or handle error appropriately
      }

      // Delete the cart item
      await cartItem.destroy();

      req.session.message = {
          type: 'info',
          message: 'Cart item deleted successfully'
      };
      res.redirect('/cart'); // Redirect to cart page or wherever appropriate
  } catch (err) {
      console.error('Error deleting cart item:', err);
      req.session.message = {
          type: 'danger',
          message: 'Error deleting cart item: ' + err.message // Provide more detail in the error message
      };
      res.redirect('/cart'); // Redirect to cart page or handle error appropriately
  }
};



exports.checkOut = (req, res, next)=>{
  res.render('items/order_checkout', {title: "Items List | Order Your Jersey",  showSidebar: false });
}






exports.postOrder = async (req, res, next) => {
  try {
    // Step 1: Get userId from request and order details from request body
    const { userId } = req.user; // Assuming you have the user information attached to the request
    const {
      productId,
      firstname,
      lastname,
      email,
      phone,
      address,
      postal_code,
      payment_method,
      shipping_method
    } = req.body; // Destructure all necessary fields from the body
     console.log(req.body)
    // Step 2: Fetch products from the user's cart if productId is not provided directly
    let cartProducts;
    if (!productId) {
      cartProducts = await Cart.findAll({ where: { userId }, include: Product });
      if (!cartProducts || cartProducts.length === 0) {
        return res.status(404).json({ message: 'No products in cart' });
      }
    }

    // Step 3: Create an order for each product
    const orderPromises = (cartProducts || [{ productId }]).map(async (item) => {
      return CartItem.create({
        userId,
        productId: item.productId, // Include the productId for each order
        orderDate: new Date(),
        status: 'Processing', // Initial order status
        firstname,
        lastname,
        email,
        phone,
        address,
        postal_code,
        payment_method,
        shipping_method
      });
    });

    const orders = await Promise.all(orderPromises);

    // Step 4: Respond with the created orders
    res.status(201).json({
      message: 'Order placed successfully!',
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place the order' });
  }
};

// exports.postOrder = (req, res, next)=>{



//   res.render('tems/order_checkout', {title: "Items List | Order Your Jersey",  showSidebar: false });
// }


