const {Product, Order, OrderCart, User, Category} = require('../../models/index');
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
              model: Category,  
              as: 'category',  
            },
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
  const quantity = 1;

  try {
    let order = await Order.findOne({ where: { userId: userId } });
    if (!order) {
      order = await Order.create({ userId: userId });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productPrice = parseFloat(product.price);

    let orderItem = await OrderCart.findOne({ where: { orderId: order.id, productId: product.id } });
    if (orderItem) {
      orderItem.quantity += quantity;
      orderItem.price = parseFloat(orderItem.price) + productPrice;
      await orderItem.save();
    } else {
      await OrderCart.create({
        orderId: order.id,
        productId: product.id,
        imageUrl: product.imageUrl,
        productName: product.productName,
        size: product.size,
        color: product.color,
        quantity,
        price: productPrice,
        amount: productPrice * quantity
      });
    }

    order.totalQuantity += quantity;
    order.totalPrice = parseFloat(order.totalPrice) + productPrice;
    await order.save();

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

















exports.getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId; // Retrieve the user ID from the session

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