const { Product } = require("../../models/index");
const fs = require("fs");


exports.homePage = (req, res, next) => {
  res.render("product/index", {
    title: "Home Page | Order Your Jersey",
    showSidebar: true,
  });
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
  res.render("product/add_product", {
    title: "Product List | Order Your Jersey",
    showSidebar: true,
  });
};

exports.addProduct = async (req, res, next) => {
  const {
    productName,
    productCategories,
    productBrand,
    productWeight,
    description,
    gender,
    color,
    size,
    tagNumber,
    productStock,
    tag,
    productPrice,
    productDiscount,
    productTax,
    imageUrl,
  } = req.body;
  console.log(req.body);
  try {
    // Create the product
    const product = await Product.create({
      productName,
      productCategories,
      productBrand,
      productWeight,
      gender,
      color,
      size,
      description,
      tagNumber,
      productStock,
      tag,
      productPrice,
      productDiscount,
      productTax,
      imageUrl: req.file.filename,
    });

    // Set a success message in the session
    req.session.message = {
      data: product,
      type: "success",
      message: "Product added successfully",
    };

    // Redirect to the home page
    res.redirect("/");
  } catch (err) {
    // Log the error and send a JSON response
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};


exports.getEditProductPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Use Sequelize's findByPk method to find the product by primary key
    const products = await Product.findByPk(id);

    if (!products) {
      // Check if product is not found
      req.session.message = {
        type: "danger",
        message: "Product not found",
      };
      return res.redirect("/");
    }

    // Render the edit page with the product data
    res.render("product/edit_product", {
      title: "Edit Product | Order Your Jersey",
      products: products, // Use `product` here, not `products`
      showSidebar: true,
    });
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
    productName, productCategories,productBrand, productWeight, description, gender,tagNumber,
    productStock, tag, productPrice, productDiscount,productTax, imageUrl,
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

    // Update the product properties
    products.productName = productName;
    products.productCategories = productCategories;
    products.productBrand = productBrand;
    products.productWeight = productWeight;
    products.gender = gender;
    products.image = new_image; // Corrected from `products.image: new_image`
    products.description = description;
    // products.size = size; 
    // products.color = color;
    products.tagNumber = tagNumber;
    products.productStock = productStock;
    products.tag = tag;
    products.productPrice = productPrice;
    products.productDiscount = productDiscount;
    products.productTax = productTax;

    // Save the updated product
    await products.save();

    // Redirect or render the page after successful update
    req.session.message = {
      type: "success",
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








  

  


