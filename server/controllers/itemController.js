const {Product, Cart, CartItem, User, Order, OrderItem, ShippingDetail } = require('../../models/index');
const { Sequelize } = require('sequelize'); 
const { v4: uuidv4 } = require('uuid');  // For generating unique order numbers
const { calculateCartTotals } = require('../../utils/cartUtils')
const bcrypt = require('bcryptjs')

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




exports.addTotCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user?req.user.id:null; // Get the userId from the session
  const sessionId = req.sessionID; // Get the session ID from the request
  const quantity = 1; // Default quantity to add

  try {
    const whereCondition = userId  ? { userId: userId }  : { sessionId: sessionId }; 
     console.log('my Session', sessionId)
    let cart = await Cart.findOne({
      where: whereCondition,
    });
    
    if (!cart) {
      // Create a new cart with userId and sessionId
      cart = await Cart.create({ userId: userId, sessionId: sessionId });
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
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id },
      include: [
        { model: Product, as: 'product' },  // Use the correct alias from your association
        { model: Cart, as: 'cart' }
      ]
     });
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
        userId,
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


exports.getCart = async (req, res) => {
  try {
    const user_or_session_id = req.user?req.user.id:req.sessionID;
    console.log("User or session Id: ",user_or_session_id)
    const { subtotal, totalDiscount, totalTax, items, } = await calculateCartTotals(user_or_session_id);

    // Calculate the estimated delivery date
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = estimatedDeliveryDate.toLocaleDateString('en-US', options);

    // Calculate the final total price (Subtotal - Discount + Tax)
    const total = subtotal;

    // Render the view with items, subtotal, total price, total discount, and tax
    res.render('items/cart', {
      showSidebar: false,
      items,
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      total: total.toFixed(2),
      estimatedDeliveryDate: formattedDate,
    });
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



exports.deleteCartItem = async (req, res, next) => {
  const cartItemId = req.params.id; // Get cart item ID from URL parameters

  try {
      // Step 1: Find the cart item by ID
      const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

      if (!cartItem) {
          req.session.message = {
              type: 'danger',
              message: 'Cart item not found'
          };
          return res.redirect('/cart'); // Redirect to cart page or handle error appropriately
      }

      // Step 2: Get the Cart ID from the cart item
      const cartId = cartItem.cartId;

      // Step 3: Delete the cart item
      await cartItem.destroy();

      // Step 4: Check if the Cart is empty after deletion
      const remainingItemsCount = await CartItem.count({ where: { cartId: cartId } });
      if (remainingItemsCount === 0) {
          // If there are no remaining items, delete the cart
          await Cart.destroy({ where: { id: cartId } });
          req.session.message = {
              type: 'info',
              message: 'Cart deleted as it was empty'
          };
      } else {
          req.session.message = {
              type: 'info',
              message: 'Cart item deleted successfully'
          };
      }

      // Step 5: Redirect to cart page
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


exports.getAccount = async (req, res, next) => {
  try {
    const user_or_session_id = req.user?req.user.id:req.sessionID;

    // Get cart totals
    const { subtotal, totalDiscount, totalTax } = await calculateCartTotals(user_or_session_id);

    // Estimated delivery date
    const estimatedDeliveryDate = 'October 10, 2024'; // Example date

    // Clear the session message before rendering
    const message = req.session.message || null;
    req.session.message = null; // Clear the message after capturing it

    // Render the view with dynamic values
    res.render('items/create_account', {
      title: "Items List | Order Your Jersey",
      showSidebar: false,
      message: req.session.message || null, // Pass session message
       type: req.session.message?.type || null, // Pass the type (success or danger)
       
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      total: subtotal.toFixed(2), // If total is just subtotal in this case
      estimatedDeliveryDate,
    });
    req.session.message = null; // Clear the session message after rendering
  } catch (error) {
    console.error("Error fetching cart details:", error);
    next(error);
  }
};


exports.createAccount = async (req, res, next) => {
  const { fullName, email, phone, password, crfpassword, address, state, city, postal_code, country } = req.body;

  let currentUser; // Define currentUser here

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      // If the user exists, allow updating their account
      // Password checks and updates are optional
      if (password || crfpassword) {
        // Check if password and confirm password match
        if (!password || !crfpassword || password !== crfpassword) {
          req.session.message = {
            type: 'danger',
            message: 'Passwords do not match or are missing',
          };
          return res.redirect('/create_account');
        }

        // Server-side password length validation
        if (password.length < 4) {
          req.session.message = {
            type: 'danger',
            message: 'Password must be at least 4 characters long',
          };
          return res.redirect('/create_account');
        }

        // Encrypt the new password
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        existingUser.password = encryptedPassword; // Update the password
      }

      // Update other user details
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      await existingUser.save(); // Save updated user details

      currentUser = existingUser; // Assign existing user to currentUser

    } else {
      // Create a new user if no existing user found
      // Validate password if creating a new account
      if (!password || !crfpassword || password !== crfpassword) {
        req.session.message = {
          type: 'danger',
          message: 'Passwords do not match or are missing',
        };
        return res.redirect('/create_account');
      }

      // Server-side password length validation
      if (password.length < 4) {
        req.session.message = {
          type: 'danger',
          message: 'Password must be at least 4 characters long',
        };
        return res.redirect('/create_account');
      }

      // Encrypt the password
      const saltRounds = 10;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      currentUser = await User.create({
        fullName,
        email,
        phone,
        password: encryptedPassword,
      });

      // Save user ID to session
      req.session.user = currentUser;
      req.session.userId = currentUser.id;
    }

    // Create or update shipping details
    await ShippingDetail.upsert({
      userId: currentUser.id, // Use currentUser here
      address,
      state,
      city,
      postal_code,
      country,
    });

    // Update the cart with the user's ID
    await Cart.updateUserIdBySessionId(req.session.id, currentUser.id); // Use currentUser here

    // Set success message and redirect to confirmation page
    req.session.message = {
      type: 'success',
      message: 'Account updated successfully' + (existingUser ? '' : ' and created successfully'),
    };
    res.redirect('/confirmation_page');
  } catch (err) {
    console.error("Error in account creation/updating:", err);
    req.session.message = {
      type: 'danger',
      message: err.message,
    };
    res.redirect('/checkout');
  }
};





exports.getShippingDetails = async (req, res, next) => {
  try {
    const user_or_session_id = req.user?req.user.id:req.sessionID;

    // Get cart totals
    const { subtotal, totalDiscount, totalTax,  } = await calculateCartTotals(user_or_session_id);

    // Calculate the total amount including delivery charge
    const total = parseFloat(subtotal) 

    // Estimated delivery date
    const estimatedDeliveryDate = 'October 10, 2024'; // Example date

    // Render the view with dynamic values
    res.render('items/shipping_details', {
      title: "Items List | Order Your Jersey",
      showSidebar: false,
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      total: total.toFixed(2), // Correctly calculate total
      estimatedDeliveryDate,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    next(error);
  }
}




// Controller to render the confirmation page
exports.getConfirmation = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    // Fetch the user details
    const user = await User.findByPk(userId);

    // Fetch shipping details for the user
    const shippingDetails = await ShippingDetail.findOne({ where: { userId } });

    // Fetch the user's cart (assumes user has a cart)
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error('No cart found for the user');
    }

    // Fetch the cart items for the cart
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{
        model: Product,
        as: 'product',
      }],
    });

    // Initialize totals
    let subtotal = 0;
    let totalDiscount = 0;

    const products = [];

    for (const item of cartItems) {
      const product = item.product;

      if (!product) {
        console.warn('No product found for cart item:', item);
        continue;
      }

      const originalPrice = parseFloat(product.price) || 0;
      const discount = parseFloat(product.discount || 0);
      const quantity = parseInt(item.quantity, 10) || 0;
      const taxPerUnit = parseFloat(product.tax || 0);

      // Calculate per-product amounts
      const totalTax = taxPerUnit * quantity;
      const totalDiscountPerProduct = discount * quantity;
      const totalPricePerProduct = (originalPrice + taxPerUnit) * quantity;

      // Accumulate totals
      subtotal += totalPricePerProduct;
      totalDiscount += totalDiscountPerProduct;

      products.push({
        productName: product.productName,
        quantity,
        price: originalPrice,
        tax: totalTax,
        discount: totalDiscountPerProduct,
        total: totalPricePerProduct,
        imageUrl: product.imageUrl,
        size: product.size,
      });
    }

    const grandTotal = subtotal - totalDiscount;

    res.render('items/confirmation_page', {
      user,
      shippingDetails,
      products,
      subtotal,
      discount: totalDiscount,
      grandTotal,
      showSidebar: false,
    });
  } catch (err) {
    console.error("Error fetching confirmation details:", err);
    req.session.message = {
      type: 'danger',
      message: 'Could not fetch confirmation details.',
    };
    res.redirect('/create_account');
  }
};


exports.editCreateAccount = async (req, res, next) => {
  const userId = req.session.userId;
  console.log("Edit Account Called. UserID:", userId); // Debugging line

  try {
    // Fetch the user details
    const user = await User.findByPk(userId);
    console.log("Fetched User:", user); // Debugging line

    if (!user) {
      req.session.message = {
        type: 'danger',
        message: 'User not found.',
      };
      return res.redirect('/create_account');
    }

    // Fetch shipping details
    const shippingDetails = await ShippingDetail.findOne({ where: { userId } });

    // Get cart totals
    const { subtotal, totalDiscount, totalTax } = await calculateCartTotals(userId);

    // Define estimated delivery date
    const estimatedDeliveryDate = 'October 10, 2024'; // Adjust as necessary

    // Clear the session message
    const message = req.session.message || null;
    req.session.message = null;

    // Render the view
    res.render('items/create_account', {
      user,
      shippingDetails,
      message,
      showSidebar: false,
      type: message?.type || null,
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      total: (subtotal - totalDiscount + totalTax).toFixed(2),
      estimatedDeliveryDate,
    });
  } catch (error) {
    console.error("Error fetching user or cart details:", error);
    req.session.message = {
      type: 'danger',
      message: 'Error retrieving user details.',
    };
    res.redirect('/create_account');
  }
};








exports.getOrder = async (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send('You must be logged in to view the checkout page');
  }

  try {
    const orders = await Order.findAll({ where: { userId } });
    console.log('Orders for user:', orders); // Debug log

    const latestOrder = await Order.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!latestOrder) {
      return res.status(404).send('No order found for checkout');
    }

    res.render('items/checkout', {
      title: 'Items List | Order Your Jersey',
      showSidebar: false,
      totalAmount: latestOrder.amount,
      orderNo: latestOrder.order_no,
      orderDate: latestOrder.createdAt.toISOString().split('T')[0],
      status: latestOrder.status,
    });
  } catch (error) {
    console.error('Error retrieving order for checkout:', error);
    res.status(500).send('Error occurred while loading the checkout page');
  }
};

exports.verifyPayments = async (req, res) => {
  const { reference, totalAmount } = req.body;

  try {
    // Verify the transaction with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Your Paystack secret key
      },
    });

    const paymentData = response.data;

    // Check if the payment was successful
    if (paymentData.data.status === 'success') {
      // Payment verified, now create the order
      await createOrder(req, res, totalAmount);
    } else {
      res.status(400).json({ status: 'failed', message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Error during payment verification' });
  }
};

exports.verifyPayment = async (req, res, next) => {
  const { reference } = req.body;

  try {
    // Verify the transaction with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Your Paystack secret key
      },
    });

    const paymentData = response.data;

    // Check if the payment was successful
    if (paymentData.data.status === 'success') {
      // Payment verified, now create the order
      await createOrder(req, res, next); // Call your existing createOrder function
    } else {
      res.status(400).json({ status: 'failed', message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Error during payment verification' });
  }
};

exports.createOrder = async (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    console.log('User not logged in');
    return res.status(401).send('You must be logged in to checkout');
  }

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      console.log('Cart is empty');
      return res.status(400).send('Cart is empty');
    }

    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
    if (cartItems.length === 0) {
      console.log('No items in cart to order');
      return res.status(400).send('No items in cart to order');
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      totalAmount += product.price * item.quantity;
    }

    const orderNo = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create the order
    const order = await Order.create({
      userId,
      order_no: orderNo,
      status: 'pending',
      amount: totalAmount,
    });

    if (!order) {
      console.error('Order creation failed');
      return res.status(500).send('Failed to create order');
    }

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.destroy();

    console.log('Order created:', order);
    // You need to forward to payment success page
    res.render('items/checkout', {
      orderNo: orderNo,
      totalAmount: totalAmount.toFixed(2),
      status: order.status,
      orderDate: new Date().toISOString().split('T')[0],
      discount: 60.00,
    });
  } catch (err) {
    console.error('Error occurred during checkout:', err);
    res.status(500).send('Error occurred during checkout');
  }
};










