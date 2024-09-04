const {Product, Order, OrderCart} = require('../../models/index');
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


// In your itemController.js or wherever you handle add to cart logic
exports.postCart = async (req, res, next) => {
    try {
        const userId = req.session.userId; // Retrieve the user ID from the session
        const { productId } = req.body;
    
        if (!userId) {
          return res.status(400).send('User not identified');
        }
    
        let order = await Order.findOne({
          where: { userId, status: 'pending' },
          include: [{ model: OrderCart, as: 'orderCarts' }]
        });
    
        if (!order) {
          order = await Order.create({ userId, status: 'pending' });
        }
    
        const product = await Product.findByPk(productId);
    
        if (!product) {
          return res.status(404).send('Product not found');
        }
    
        const existingOrderItem = await OrderItem.findOne({
          where: { orderId: order.id, productId }
        });
    
        if (existingOrderItem) {
          existingOrderItem.productStock += 1;
          existingOrderItem.amount = existingOrderItem.productStock * existingOrderItem.unitPrice;
          await existingOrderItem.save();
        } else {
          await OrderItem.create({
            orderId: order.id,
            productId,
            productStock: 1,
            size: product.size,
            color: product.color,
            productPrice: product.productPrice,
            productTax: product.productTax,
            imageUrl: product.imageUrl
          });
        }
    
        res.redirect('/cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Server error');
      }
};



exports.getCart = async (req, res, next) => {
    try {
      const userId = req.session.userId; // Retrieve the user ID from the session
  
      if (!userId) {
        return res.render('items/item_lists', { items: [], total: 0, showSidebar: false });
      }
  
      const order = await Order.findOne({
        where: { userId, status: 'pending' },
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
  
      if (!order) {
        return res.render('items/cart', { items: [], total: 0, showSidebar: false });
      }
  
      const total = order.orderCarts.reduce((acc, item) => acc + item.productTax, 0);
  
      res.render('items/cart', { items: order.orderCarts, total, showSidebar: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).send('Server error');
    }
  };
  



exports.checkOut = (req, res, next)=>{
    res.render('items/check_out', {title: "Items List | Order Your Jersey",  showSidebar: false });
}