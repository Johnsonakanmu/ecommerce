const {Product, Order, OrderCart} = require('../../models/index');
const { Sequelize } = require('sequelize'); 
const crypto = require('crypto');
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



exports.postCart = async (req, res, next) => {
  try {
    let userId = req.session.userId;

    // Step 1: Check if the user is logged in (i.e., if userId is in session)
    if (!userId) {
      // Generate a sessionId if the user is not logged in
      const sessionId = `sessionId_${crypto.randomUUID()}`;

      // Step 2: Create a new user with only a sessionId
      const newUser = await User.create({ sessionId });  // Save sessionId in DB
      userId = newUser.id;  // Store the userId in the session

      // Step 3: Store userId and sessionId in the session
      req.session.userId = userId;
      req.session.sessionId = sessionId;
    }

    const { productId } = req.body;

    // Step 4: Find the product based on the productId
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Step 5: Find or create the cart item for the user
    let cartItem = await OrderCart.findOne({
      where: { userId, productId }
    });

    if (cartItem) {
      // If the cart item exists, update the quantity and amount
      cartItem.productStock += 1;
      cartItem.amount = cartItem.productStock * cartItem.productPrice;
      await cartItem.save();
    } else {
      // If the cart item doesn't exist, create a new entry in the OrderCart table
      await OrderCart.create({
        userId,
        productId,
        imageUrl: product.imageUrl,
        productName: product.productName,
        size: product.size,
        color: product.color,
        productStock: 1,
        productPrice: product.productPrice,
        amount: product.productPrice // Initial amount is the product price
      });
    }

    // Step 6: Redirect to the cart page or send a success response
    res.redirect('/items/cart');  // You can change this to API response if needed
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Server error');
  }
};






exports.getCart = async (req, res, next) => {
  try {
    const userId = req.session.userId; // Retrieve the user ID from the session

    // Check if the user is logged in
    if (!userId) {
      return res.render('items/item_lists', { items: [], total: 0, showSidebar: false });
    }

    // Find the order for the user (since there's no 'status' column, we won't filter by status)
    const order = await Order.findOne({
      where: { userId }, // Only filter by userId
      include: [
        {
          model: OrderCart,
          as: 'orderCarts',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    // If no order exists for the user, render an empty cart
    if (!order) {
      return res.render('items/cart', { items: [], total: 0, showSidebar: false });
    }

    // Calculate the total from the cart items
    const total = order.orderCarts.reduce((acc, item) => acc + item.amount, 0);

    // Render the cart page with the order items and the total
    res.render('items/cart', { items: order.orderCarts, total, showSidebar: false });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Server error');
  }
};

  



exports.checkOut = (req, res, next)=>{
    res.render('items/check_out', {title: "Items List | Order Your Jersey",  showSidebar: false });
}