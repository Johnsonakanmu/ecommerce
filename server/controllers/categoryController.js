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
    // Find the user with ID 1 (the manually created user)
    const user = await User.findByPk(2); // Use ID 1 explicitly

    if (!user) {
      throw new Error("User not found");
    }

    const { firstname, lastname } = user;

    // Log or use firstname and lastname (optional)
    console.log(`Adding category for ${firstname} ${lastname}`);

    // Use the `createCategory` method to add the category for this user
    await user.createCategory({
      productName,
      description
    });

    // Set a success message in the session
    req.session.message = {
      type: "success",
      message: `Category added successfully by ${firstname} ${lastname}`,
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


