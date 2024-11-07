const {
  Product,Cart, CartItem, User, Order, OrderItem, ShippingDetail,  sequelize
} = require("../../models/index");
const axios = require('axios')
const { Sequelize } = require("sequelize");
const { calculateCartTotals } = require("../../utils/cartUtils");
const { generateOrderNumber} = require ('../../utils/generateOrderId')
const bcrypt = require("bcryptjs");

const deleteCartItemsAfterOrder = async (cartId) => {
  try {
    // Fetch the cart associated with the cart ID
    const cart = await Cart.findByPk(cartId);

    // Check if the cart exists
    if (!cart) {
      throw new Error("Cart not found.");
    }

    // Delete all cart items associated with the cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Clear the cart totals
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    return { message: "All cart items deleted successfully after order." };
  } catch (err) {
    console.error("Error deleting cart items after order:", err);
    throw new Error("Could not delete cart items after order.");
  }
};


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
          as: "user",
        },
      ],
      limit: limit, // Number of products to fetch
      offset: offset, // Number of products to skip
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(productCount / limit);

    // Render the 'index' view with the fetched products and pagination data
    res.render("items/item_lists", {
      title: "Home Page | Order Your Jersey",
      showSidebar: false,
      productCount: productCount.toLocaleString(),
      products: products,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
    });
  } catch (err) {
    // Handle any errors by sending a JSON response with the error message
    res.json({ message: err.message });
  }
};

exports.searchItem = async (req, res) => {
  try {
    const searchTerm = req.query.q || "";

    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch products based on search term
    const products = await Product.findAll({
      where: {
        productName: {
          [Sequelize.Op.like]: `%${searchTerm}%`,
        },
      },
      limit: limit,
      offset: (currentPage - 1) * limit,
    });

    const productCount = products.length;
    const totalPages = Math.ceil(productCount / limit);

    // Render the search results and pass searchTerm to the template
    res.render("items/item_lists", {
      title: "Product Search Results",
      showSidebar: false,
      products: products,
      searchTerm: searchTerm, // Make sure this line is present
      productCount: productCount.toLocaleString(),
      currentPage: currentPage,
      totalPages: totalPages,
      limit: limit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user ? req.user.id : null; // Get the userId from the session
  const sessionId = req.sessionID; // Get the session ID from the request
  const quantity = 1; // Default quantity to add

  try {
    const whereCondition = userId
      ? { userId: userId }
      : { sessionId: sessionId };
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
      return res.status(404).json({ message: "Product not found" });
    }


    // Step 3: Calculate Price, Discount, and Tax
    const originalPrice = parseFloat(product.price); 
    const discount = parseFloat(product.discount || 0); 
    const discountedPrice = originalPrice - discount; 
    const tax = product.tax || 0; 

    // Step 4: Check if Product Already Exists in the Cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId: product.id },
      include: [
        { model: Product, as: "product" }, // Use the correct alias from your association
        { model: Cart, as: "cart" },
      ],
    });
    if (cartItem) {
      // Update the existing item in the cart
      cartItem.quantity += quantity;
      cartItem.price = originalPrice; 
      cartItem.discount = discount; 
      cartItem.amount = discountedPrice * cartItem.quantity; 
      cartItem.tax = tax; 
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
        price: originalPrice,
        discount, 
        amount: discountedPrice * quantity, 
        tax, 
      });
    }

    // Step 5: Update Cart Summary (Total Quantity and Price)
    cart.totalQuantity = (cart.totalQuantity || 0) + quantity;
    cart.totalPrice = (cart.totalPrice || 0) + discountedPrice * quantity; // Reflect discounted price in total
    await cart.save();

    // Step 6: Redirect to Cart Page
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCart = async (req, res) => {
  try {
    const user_or_session_id = req.user ? req.user.id : req.sessionID;
    console.log("User or session Id: ", user_or_session_id);
    const { subtotal, totalDiscount, totalTax, items } =
      await calculateCartTotals(user_or_session_id);

    // Calculate the estimated delivery date
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = estimatedDeliveryDate.toLocaleDateString(
      "en-US",
      options
    );

    // Calculate the final total price (Subtotal - Discount + Tax)
    const total = subtotal;

    // Render the view with items, subtotal, total price, total discount, and tax
    res.render("items/cart", {
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
    res.status(500).send("Internal Server Error");
  }
};

exports.updateCartItemQuantity = async (req, res, next) => {
  const cartItemId = req.params.id; // Make sure this is the cart item ID, not product ID
  const newQuantity = req.body.quantity;

  try {
    // Find the cart item by cartItemId, not productId
    const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Update the quantity if found
    cartItem.quantity = newQuantity;
    cartItem.amount = cartItem.price * newQuantity;
    await cartItem.save();

    // Optionally redirect or respond with a success message
    res.redirect("/cart"); // or res.json({ message: 'Quantity updated successfully' });
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ message: "Error updating cart item quantity" });
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const cartItemId = req.params.id; // Get cart item ID from URL parameters

  try {
    // Step 1: Find the cart item by ID
    const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

    if (!cartItem) {
      req.session.message = {
        type: "danger",
        message: "Cart item not found",
      };
      return res.redirect("/cart"); // Redirect to cart page or handle error appropriately
    }

    // Step 2: Get the Cart ID from the cart item
    const cartId = cartItem.cartId;

    // Step 3: Delete the cart item
    await cartItem.destroy();

    // Step 4: Check if the Cart is empty after deletion
    const remainingItemsCount = await CartItem.count({
      where: { cartId: cartId },
    });
    if (remainingItemsCount === 0) {
      // If there are no remaining items, delete the cart
      await Cart.destroy({ where: { id: cartId } });
      req.session.message = {
        type: "info",
        message: "Cart deleted as it was empty",
      };
    } else {
      req.session.message = {
        type: "info",
        message: "Cart item deleted successfully",
      };
    }

    // Step 5: Redirect to cart page
    res.redirect("/cart"); // Redirect to cart page or wherever appropriate
  } catch (err) {
    console.error("Error deleting cart item:", err);
    req.session.message = {
      type: "danger",
      message: "Error deleting cart item: " + err.message, // Provide more detail in the error message
    };
    res.redirect("/cart"); // Redirect to cart page or handle error appropriately
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const user_or_session_id = req.user ? req.user.id : req.sessionID;

    // Get cart totals
    const { subtotal, totalDiscount, totalTax } = await calculateCartTotals(
      user_or_session_id
    );

    // Estimated delivery date
    const estimatedDeliveryDate = "October 10, 2024"; // Example date

    // Clear the session message before rendering
    const message = req.session.message || null;
    req.session.message = null; // Clear the message after capturing it

    // Render the view with dynamic values
    res.render("items/create_account", {
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
  const {
    fullName, email, phone, password, crfpassword, address, state, city, country,
  } = req.body;

  let currentUser;
  let subtotal = 0; // Initialize subtotal
  let estimatedDeliveryDate = null; // Initialize estimatedDeliveryDate

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    const errors = {}; // Store validation errors
    // Check if password and confirm password match
    if (password || crfpassword) {
      if (!password || !crfpassword) {
        errors.confirmPassword = "Password and confirm password are required";
      } else if (password !== crfpassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      // Password length validation
      if (password && password.length < 4) {
        errors.passwordLength = "Password must be at least 4 characters long";
      }
    }

    // Logic for calculating subtotal (even if there are errors)
    const cartItems = await Cart.getItemsBySessionId(req.sessionID); // Get cart items
    subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); // Calculate subtotal

    // Set estimated delivery date (example: add 5 days to current date)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    estimatedDeliveryDate = deliveryDate.toLocaleDateString(); // Format as needed

    if (Object.keys(errors).length > 0) {
      // If there are validation errors, render the form with error messages
      return res.render("items/create_account", {
        errors, fullName, email, phone, address, state, city, country,
        subtotal, estimatedDeliveryDate, showSidebar: false,
      });
    }

    // Existing user logic
    if (existingUser) {
      if (password) {
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        existingUser.password = encryptedPassword;
      }

      existingUser.fullName = fullName;
      existingUser.phone = phone;
      await existingUser.save();
      currentUser = existingUser;
    } else {
      const saltRounds = 10;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      currentUser = await User.create({
        fullName, email, phone,
        password: encryptedPassword,
      });
    }

    req.session.user = currentUser;
    req.session.userId = currentUser.id;

    await ShippingDetail.upsert({
      userId: currentUser.id,
      address, state, city, country,
    });

    await Cart.updateUserIdBySessionId(req.sessionID, currentUser.id);

    req.session.message = {
      type: "success",
      message:
        "Account updated successfully" +
        (existingUser ? "" : " and created successfully"),
    };

    res.redirect("/confirmation_page");
  } catch (err) {
    console.error("Error in account creation/updating:", err);
    res.render("auth/login", {
      errors: { general: "An error occurred. Please try again." },
      fullName, email, phone, address, state, city, country,
      subtotal, estimatedDeliveryDate, showSidebar: false,
    });
  }
};



exports.getShippingDetails = async (req, res, next) => {
  try {
    const user_or_session_id = req.user ? req.user.id : req.sessionID;

    // Get cart totals
    const { subtotal, totalDiscount, totalTax } = await calculateCartTotals(
      user_or_session_id
    );

    // Calculate the total amount including delivery charge
    const total = parseFloat(subtotal);

    // Estimated delivery date
    const estimatedDeliveryDate = "October 10, 2024"; // Example date

    // Render the view with dynamic values
    res.render("items/shipping_details", {
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
};

// Controller to render the confirmation page
exports.getConfirmation = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    // Check if userId is defined
    if (!userId) {
      throw new Error("User ID is not defined in the session.");
    }

    // Fetch the user details
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Fetch shipping details for the user
    const shippingDetails = await ShippingDetail.findOne({ where: { userId } });
    if (!shippingDetails) {
      throw new Error("Shipping details not found for the user.");
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error("No cart found for the user.");
    }

    // Fetch the cart items for the cart
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    // Initialize totals
    let subtotal = 0;
    let totalDiscount = 0;

    const products = [];

    for (const item of cartItems) {
      const product = item.product;

      // Skip if no product is found
      if (!product) {
        console.warn("No product found for cart item:", item);
        continue;
      }

      // Parse prices and quantities safely
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
         payment_key: process.env.PAYSTACK_PUBLIC_KEY
      });
    }

    const grandTotal = subtotal - totalDiscount;

    // Render the confirmation page
    res.render("items/confirmation_page", {
      user,
      shippingDetails,
      products,
      subtotal: subtotal.toFixed(2), // Formatting subtotal
      discount: totalDiscount.toFixed(2), // Formatting discount
      grandTotal: grandTotal.toFixed(2), // Formatting grand total
      showSidebar: false,
    });
  } catch (err) {
    console.error("Error fetching confirmation details:", err);
    req.session.message = {
      type: "danger",
      message: "Could not fetch confirmation details.",
    };
    res.redirect("/login");
  }
};



exports.editCreateAccount = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    // Fetch the user details
    const user = await User.findByPk(userId);

    if (!user) {
      req.session.message = {
        type: "danger",
        message: "User not found.",
      };
      return res.redirect("/create_account");
    }

    // Fetch shipping details
    const shippingDetails = await ShippingDetail.findOne({ where: { userId } });

    // Get cart totals
    const { subtotal, totalDiscount, totalTax } = await calculateCartTotals(
      userId
    );

    // Define estimated delivery date
    const estimatedDeliveryDate = "October 10, 2024"; // Adjust as necessary

    // Clear the session message
    const message = req.session.message || null;
    req.session.message = null;

    // Render the view
    res.render("items/create_account", {
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
      type: "danger",
      message: "Error retrieving user details.",
    };
    res.redirect("/create_account");
  }
};

exports.getOrder = async (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return res
      .status(401)
      .send("You must be logged in to view the checkout page");
  }

  try {
    const orders = await Order.findAll({ where: { userId } });
    console.log("Orders for user:", orders); // Debug log

    const latestOrder = await Order.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!latestOrder) {
      return res.status(404).send("No order found for checkout");
    }

    res.render("items/checkout", {
      title: "Items List | Order Your Jersey",
      showSidebar: false,
      totalAmount: latestOrder.amount,
      orderNo: latestOrder.order_no,
      orderDate: latestOrder.createdAt.toISOString().split("T")[0],
      status: latestOrder.status,
    });
  } catch (error) {
    console.error("Error retrieving order for checkout:", error);
    res.status(500).send("Error occurred while loading the checkout page");
  }
};

exports.verifyPayments = async (req, res) => {
  const { reference, totalAmount } = req.body;
  const token =  process.env.PAYSTACK_PRIVATE_KEY
  try {
    // Verify the transaction with Paystack
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await axios({
      method: 'get',
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      headers,
    });
    console.log("Request Headers:", headers);
    console.log("Request URL:", `https://api.paystack.co/transaction/verify/${reference}`);

    const paymentData = response.data;

    // Check if the payment was successful
    if (paymentData.data.status === "success") {
      // Payment verified, now create the order
      await this.createOrder(req, res, totalAmount);
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Payment verification failed" }); 
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error during payment verification" });
  }
};


exports.createOrder = async (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    console.log("User not logged in");
    return res.status(401).send("You must be logged in to checkout");
  }


  try {
    const cart = await Cart.findOne({ where: { userId }  });
    if (!cart) {
      console.log("Cart is empty");
      return res.status(400).send("Cart is empty");
    }

    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
    if (cartItems.length === 0) {
      console.log("No items in cart to order");
      return res.status(400).send("No items in cart to order");
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        console.log(`Product ${item.productId} not found`);
        return res.status(404).send("One or more products not found");
      }

      // Check stock availability based on quantity
      if (item.quantity > (product.quantity - product.quantitySold)) {
        console.log(`Not enough stock for product ${item.productId}`);
        return res.status(400).send(`Not enough stock available for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
    }

    // Fetch or generate the shippingDetailId if needed
    const shippingDetail = await ShippingDetail.findOne({ where: { userId } });
    if (!shippingDetail) {
      console.log("No shipping details found");
      return res.status(400).send("No shipping details found");
    }

    // Generate the custom order number
    const order_no = generateOrderNumber();

    // Create the order
    const order = await Order.create({
      userId,
      order_no, // Include the order number
      shippingDetailId: shippingDetail.id, // Provide the shipping detail ID
      status: "pending",
      amount: totalAmount,
    });

    if (!order) {
      console.error("Order creation failed");
      return res.status(500).send("Failed to create order");
    }

    // Create order items and update product stock
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      product.quantitySold += item.quantity;
      // Assuming you want to adjust the quantity field directly
      await product.save(); // Save the updated product stock

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        imageUrl: item.imageUrl,
        size: item.size,
        color: item.color,
        price: item.price,
        amount: item.amount,
        discount: item.discount,
        total: item.total,
        tax: item.tax,
        userId: cart.userId,
        cartId: cart.id,
      });
    }

   
      await deleteCartItemsAfterOrder(cart.id); // Call the delete function
      console.log("delete", deleteCartItemsAfterOrder)

  // Store success message in session
    req.session.successMessage = "Your order has been placed successfully!";
    console.log("Order created successfully. Redirecting to success page...");
    // Redirect to success page
    res.redirect("/items/success_page",);
  } catch (err) {
    console.error("Error occurred during checkout:", err);
    res.status(500).send("Error occurred during checkout");
  }
};


exports.getTransactionSuccess = (req, res, next) => {
  // Retrieve the success message from the session
  const successMessage = req.session.successMessage || "Your transaction was successful!";
  
  // Clear the success message from the session after retrieving it
  delete req.session.successMessage;

  // Render the success page and pass the successMessage to the template
  res.render("items/transaction_success", {
    successMessage, // Pass the success message
    showSidebar: false,
  });
};




exports.getTransactionFailed = (req, res, next) => {
  // Retrieve the error message from the session or request (if applicable)
  const errorMessage = req.session.errorMessage || "An unknown error occurred.";

  // Clear the error message from the session after retrieving it
  delete req.session.errorMessage;

  // Render the failure page
  res.render("items/transaction_failed", {
    errorMessage,
    showSidebar: false
  });
};





