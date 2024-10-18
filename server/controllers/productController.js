const { Product, CartItem, Order } = require("../../models/index");
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
      attributes: ['id', 'productName', 'price', 'quantity', 'soldAmount', 'imageUrl', 'size', 'createdBy' ],
      order: [['createdAt', 'DESC']], // Adjust order as needed
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
          required: false, // Make this a left join
        },
      ],

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

// For pagination
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
  res.render("product/add_product", {
    title: "Product List | Order Your Jersey",
    showSidebar: true,
  });
};




exports.addProduct = async (req, res, next) => {
  const {
    productName, productCategories, productBrand, description, gender, color,
    size, tagNumber, quantity, tag, price, discount, tax, discountType,
  } = req.body;

  try {
    // Check if the file was uploaded
    if (!req.file) {
      throw new Error("Product image is required.");
    }

    // Convert price and discount to numbers
    const priceValue = parseFloat(price);
    const discountValue = parseFloat(discount);
    
    // Calculate the discounted price
    let sellingPrice = priceValue;
    let isDiscount = false;

    if (discountType === "Percentage") {
      isDiscount = true;
      sellingPrice = priceValue - (priceValue * discountValue / 100);
    } else if (discountType === "Fixed") {
      isDiscount = true;
      sellingPrice = priceValue - discountValue;
    }

    // Create a product object
    const product = {
      productName, productCategories, productBrand, description, gender, color, size,
      tagNumber, quantity, tag, price: priceValue, discount: discountValue, tax,
      imageUrl: req.file.filename,
      sellingPrice, discountType, isDiscount,
      userId: null, // or some default user ID if applicable
      createdBy: null, // or some default user ID if applicable
    };

    // Create the product
    const productObj = await Product.create(product);

    req.session.message = {
      data: product,
      type: "success",
      message: "Product added successfully",
    };
    res.redirect("/");
  } catch (err) {
    console.error("Error adding product:", err);
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/");
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

    // Prepare data for rendering
    const viewsData = {
      edit: true,
      title: "Edit Product | Order Your Jersey",
      products,         // Changed to 'product'   
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


exports.updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const {
   
    productName, productCategories, productBrand, description, gender, color,
    size, tagNumber, quantity, tag, price, discount, tax, discountType
  } = req.body;

  try {
    
   // Find the product by ID
   const product = await Product.findOne({ where: { id } });

   if (!product) {
     // Check if product is not found
     req.session.message = {
       type: "danger",
       message: "Product not found",
     };
     return res.redirect("/edit_product");
   }

    // Check if the file was uploaded and update the image if present
    let imageUrl = product.imageUrl;
    if (req.file) {
      imageUrl = req.file.filename; // Use the new uploaded file's filename
    }

    // Convert price and discount to numbers
    const priceValue = parseFloat(price);
    const discountValue = parseFloat(discount);

    

    // Calculate the discounted price
    let sellingPrice = priceValue;
    let isDiscount = false;

    // Check if discount type and values are valid
    if (discountType === "Percentage") {
      // Calculate discount as a percentage
      isDiscount = true;
      sellingPrice = priceValue - (priceValue * discountValue / 100);
    } else if (discountType === "Fixed") {
      // Apply a fixed discount amount
      isDiscount = true;
      sellingPrice = priceValue - discountValue;
    } else {
      console.log("Missing or invalid discount details. Skipping discount calculation.");
    }

    // Calculate the final price including tax
    const finalPrice = sellingPrice;

    // Log the result to confirm the state of `isDiscount`
    

    // Update the product object with new data
    product.productName = productName;
    product.productCategories = productCategories;
    product.productBrand = productBrand;
    product.description = description;
    product.gender = gender;
    product.color = color;
    product.size = size;
    product.tagNumber = tagNumber;
    product.quantity = quantity;
    product.tag = tag;
    product.price = priceValue;
    product.discount = discountValue;
    product.tax = tax;
    product.imageUrl = imageUrl;
    product.sellingPrice = finalPrice;
    product.discountType = discountType;
    product.isDiscount = isDiscount;

    // Save the updated product to the database
    await product.save();

    // Set success message and redirect
    req.session.message = {
      data: product,
      type: "success",
      message: "Product updated successfully",
    };
    res.redirect("/");
  } catch (err) {
    // Log the error and send a JSON response or redirect to an error page
    console.error("Error updating product:", err);

    req.session.message = {
      type: "danger",
      message: err.message,
    };

    res.redirect("/error"); // Redirect to an error page or similar
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

        // Delete related cart items
        await CartItem.destroy({ where: { productId: id } }); // Adjust model name and field as necessary

        // Check if product has an image and delete it
        if (product.image) {
            const imagePath = `./uploads/${product.image}`;
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    console.warn(`Image not found at path: ${imagePath}`);
                }
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
            message: 'Error deleting product: ' + err.message // Provide more detail in the error message
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

    // Convert soldAmount to a number to ensure correct arithmetic
    const soldAmountValue = parseInt(soldAmount, 10);
    
    // Ensure soldAmount is a valid number
    if (isNaN(soldAmountValue) || soldAmountValue <= 0) {
      req.session.message = {
        type: "danger",
        message: "Invalid sold amount",
      };
      return res.redirect("/"); // Redirect or handle error
    }

    // Check if the sold amount exceeds available stock
    if ((product.soldAmount || 0) + soldAmountValue > product.productStock) {
      req.session.message = {
        type: "danger",
        message: "Sold amount exceeds available stock",
      };
      return res.redirect("product/product_detail"); // Redirect or handle error
    }

    // Update sold amount and save the updated product
    product.soldAmount = (product.soldAmount || 0) + soldAmountValue;

    // Save the updated product
    await product.save();

    // Redirect to product list or success page
    req.session.message = {
      type: "success",
      message: "Sold amount updated successfully",
    };
    res.redirect("/product_detail"); // Redirect to the products page or wherever appropriate
  } catch (err) {
    console.error('Error updating product sold amount:', err);
    req.session.message = {
      type: 'danger',
      message: 'Error updating product sold amount',
    };
    res.redirect('/product_detail'); // Redirect or handle error
  }
};










  

  


