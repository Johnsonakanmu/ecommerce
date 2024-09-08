const { Product, Category, User } = require("../../models/index");
const fs = require("fs");


exports.homePage = (req, res, next) => {
  res.render("product/index", {
    title: "Home Page | Order Your Jersey",
    showSidebar: true,
  });
};


exports.getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const currentPage = parseInt(req.query.page) || 1; // Current page number

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset: (currentPage - 1) * limit,
      attributes: ['id', 'productName', 'price', 'quantity', 'soldAmount', 'imageUrl', 'size'],
      order: [['createdAt', 'DESC']], // Adjust order as needed
    });

    const totalPages = Math.ceil(count / limit);

    res.render('product/product_list', {
      title: 'All Products',
      products,
      currentPage,
      totalPages,
      limit,
      showSidebar: true,
    });
  } catch (err) {
    console.error('Error retrieving products:', err);
    req.session.message = {
      type: 'danger',
      message: 'Error retrieving products',
    };
    res.redirect('/');
  }
};


exports.listView = async (req, res, next) => {
  try {
    // Parse page and limit from query parameters, with default values
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch paginated products using Sequelize's findAndCountAll method
    const { count, rows: products } = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Render the 'product_list' view with the paginated products and pagination data
    res.render("product/product_list", {
      title: "Product List | Order Your Jersey",
      showSidebar: true,
      products: products,
      currentPage: page, // Pass the current page number to the view
      totalPages: totalPages, // Pass the total number of pages to the view
      totalItems: count, // Pass the total number of items to the view
      limit: limit, // Pass the limit to the view
    });
  } catch (err) {
    // Handle any errors by sending a JSON response with the error message
    res.json({ message: err.message });
  }
};


exports.addProducts = (req, res, next) => {
  Category.findAll({ attributes: ['id', 'productName'] }).then(categories => {
    console.log(categories);  // This will log the categories to the console
    res.render("product/add_product", {
      title: "Product List | Order Your Jersey",
      showSidebar: true,
      categories: categories
    });
  }).catch(err => {
    console.error('Error fetching categories:', err);
  });
};


exports.addProduct = async (req, res, next) => {
  const {
    categoryId, productName, productBrand, description,gender,color,
    size, tagNumber, quantity, tag, price,discount,tax,
  } = req.body;

  try {
    // Fetch the user manually by ID (assuming you are using a static user ID for now)
    const userId = 1; // Replace with the correct ID of the manually created user
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Ensure categoryId is provided
    if (!categoryId) {
      throw new Error("Category ID is required.");
    }

    // Calculate the discounted price
    const discountedPrice = price - (discount || 0); // Ensure discount is applied correctly

    // Calculate the final price including tax
    const finalPrice = discountedPrice + (tax || 0); // Ensure tax is applied correctly

    // Check if the file was uploaded
    if (!req.file) {
      throw new Error("Product image is required.");
    }

    // Create a product object
    const product = {
      productName,productBrand,description,gender,color,size,
      tagNumber,quantity,tag,price,discount,tax,
      imageUrl: req.file.filename, // Ensure you're using Multer for file uploads
      finalPrice,
      categoryId, // Include the categoryId
    };

    // Fetch category and validate if it exists
    const categoryObj = await Category.findByPk(categoryId);
    if (!categoryObj) {
      throw new Error("Category not found");
    }

    // Create the product for the manually fetched user
    const productObj = await user.createProduct(product); // Use the manually fetched user to create the product
    await productObj.setCategory(categoryObj); // Associate the product with the category

    // Set success message and redirect
    req.session.message = {
      data: product,
      type: "success",
      message: "Product added successfully",
    };
    res.redirect("/");
  } catch (err) {
    // Log the error and send a JSON response or redirect to an error page
    console.error("Error adding product:", err);

    req.session.message = {
      type: "danger",
      message: err.message,
    };

    res.redirect("/error"); // Redirect to an error page or similar
  }
};





exports.getEditProductPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Fetch the product by primary key
    const products = await Product.findByPk(id);  // Changed 'products' to 'product'
    if (!products) {
      throw new Error("Product not found");
    }

    // Fetch all categories for the dropdown
    const categories = await Category.findAll({ attributes: ['id', 'productName'] });

    // Prepare data for rendering
    const viewsData = {
      edit: true,
      title: "Edit Product | Order Your Jersey",
      products,         // Changed to 'product'
      categories,      // List of categories
      showSidebar: true
    };

    // Render the edit product page
    res.render("product/edit_product", viewsData);
    
  } catch (err) {
    console.error("Error retrieving product:", err);
    req.session.message = {
      type: "danger",
      message: "Error retrieving product",
    };
    res.redirect("/");
  }
};



exports.updateProduct = async (req, res) => {
  const id = req.params.id;

  const {
    productName, productBrand, description, gender,tagNumber,
    quantity, price, discount,tax, imageUrl, categoryId
  } = req.body;

  let new_image = "";

  // Handle image upload and delete old image if necessary
  if (req.file) {
    new_image = req.file.filename;
    try {
      if (req.body.old_image) {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      }
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    // Find the product by ID
    const products = await Product.findOne({ where: { id } });

    if (!products) {
      // Check if product is not found
      req.session.message = {
        type: "danger",
        message: "Product not found",
      };
      return res.redirect("/");
    }

    // Calculate the discounted price and final price including tax
    const discountedPrice = quantity - discount;
    const finalPrice = discountedPrice + tax;

    // Update the product properties
    products.productName = productName;
    products.categoryId = categoryId;
    products.productBrand = productBrand;
    products.gender = gender;
    products.image = new_image; // Corrected from `products.image: new_image`
    products.description = description;
    products.tagNumber = tagNumber;
    products.quantity = quantity;
    products.price = price;
    products.discount = discount;
    products.tax = tax;
    products.discountedPrice = discountedPrice; 
    products.finalPrice = finalPrice; 
    
    finalPrice

    // Save the updated product
    await products.save();

    // Redirect or render the page after successful update
    req.session.message = {
      type: "success",
      products: products,
      message: "Product updated successfully",
    };
    res.redirect("/"); // Redirect to home or the desired page
  } catch (error) {
    console.error("Error updating product:", error);
    req.session.message = {
      type: "danger",
      message: "Error updating product",
    };
    res.redirect("/");
  }
};



exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;
  
    try {
      // Find the product by ID
      const product = await Product.findOne({ where: { id } });
  
      if (!product) {
        req.session.message = {
          type: 'danger',
          message: 'Product not found'
        };
        return res.redirect('/');
      }
  
      // Check if product has an image and delete it
      if (product.image) {
        try {
          fs.unlinkSync("./uploads/" + product.image);
        } catch (error) {
          console.error('Error deleting image:', error);
          req.session.message = {
            type: 'danger',
            message: 'Error deleting product image'
          };
          return res.redirect('/');
        }
      }
  
      // Delete the product
      await product.destroy();
  
      req.session.message = {
        type: 'info',
        message: 'Product deleted successfully'
      };
      res.redirect('/');
    } catch (err) {
      console.error('Error deleting product:', err);
      req.session.message = {
        type: 'danger',
        message: 'Error deleting product'
      };
      res.redirect('/');
    }
  };



// Controller function to handle product detail
exports.productDetail = async (req, res, next) => {
  try {
      let productId = req.params.id;
      // Fetch product using findByPk method
      const product = await Product.findByPk(productId);
      
      // Render the product detail view with the fetched product data
      res.render("product/product_detail", {
          title: "Edit Product | Order Your Jersey",
          showSidebar: true,
          product: product,
          showSidebar: false,
      });
  } catch (err) {
      // Handle error and provide a response
      res.status(500).json({ message: err.message });
  }
};



 exports.updateProductSoldAmount = async (req, res) => {
  const { id } = req.params; // Product ID from URL
  const { soldAmount } = req.body; // Amount to add to soldAmount

  try {
    // Find the product by ID
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      req.session.message = {
        type: "danger",
        message: "Product not found",
      };
      return res.redirect("/"); // Redirect or handle error
    }

    // Update sold amount and calculate unsold amount
    product.soldAmount = (product.soldAmount || 0) + soldAmount;
    
    if (product.soldAmount > product.productStock) {
      req.session.message = {
        type: "danger",
        message: "Sold amount exceeds available stock",
      };
      return res.redirect("/"); // Redirect or handle error
    }

    // Save the updated product
    await product.save();

    // Redirect to product list or success page
    res.redirect("/"); // Redirect to the products page or wherever appropriate
  } catch (err) {
    console.error('Error updating product sold amount:', err);
    req.session.message = {
      type: 'danger',
      message: 'Error updating product sold amount',
    };
    res.redirect('/'); // Redirect or handle error
  }
};









  

  


