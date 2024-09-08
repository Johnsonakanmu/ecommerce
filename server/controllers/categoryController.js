const {Category, User} = require('../../models/index')


exports.getCategoryPage = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: User,  // Include the User model
        as: 'user',   // Specify the alias used in the association
        attributes: ['firstname', 'lastname']  // Fetch 'firstname' and 'lastname' from the User model
      }
    });

    res.render("product/Category", {
      title: "Category Page | Order Your Jersey",
      showSidebar: true,
      categories: categories
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Server error");
  }
};


exports.getAddCategoryPage = async (req, res)=>{
    res.render("product/addCategoryPage", {
        title: "Category Page | Order Your Jersey",
        showSidebar: true,
      });
}

exports.postAddCategoryPage = async (req, res) => {
  const { productName, description } = req.body;

  try {

    req.user.createCategory({
      productName,
      description
    });

    // Set a success message in the session
    req.session.message = {
      type: "success",
      message: `Category added successfully`,
    };

    // Redirect to the categories page
    res.redirect("/categories");
  } catch (err) {
    // Log the error and handle it properly
    console.error("Error adding category:", err);

    // Set an error message in the session
    req.session.message = {
      type: "danger",
      message: err.message,
    };

    // Redirect to an error page or the form page
    res.redirect("/categories");
  }
};


