const {Order, User, OrderItem, Product} = require('../../models/index')
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');



exports.homePage = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Number of items per page
        const currentPage = parseInt(req.query.page) || 1; // Current page number
        const { date, month } = req.query; // Get filter values

        // Base filter conditions
        let filterConditions = {};

        // Check if date is provided for filtering
        if (date) {
            const selectedDate = new Date(date).toISOString().slice(0, 10); // Format to YYYY-MM-DD
            filterConditions.createdAt = {
                [Op.eq]: selectedDate
            };
        }

        // Check if month is provided for filtering
        else if (month) {
            filterConditions.createdAt = {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), new Date().getFullYear())
                ]
            };
        }

        // Fetch total orders count with the applied filter
        const totalOrders = await Order.count({ where: filterConditions });

        // Fetch canceled, delivering, and delivered orders without filters
        const [canceledOrders, deliveringOrders, deliveredOrders] = await Promise.all([
            Order.findAll({ where: { status: 'canceled' } }),
            Order.findAll({ where: { status: 'delivering' } }),
            Order.findAll({ where: { status: 'delivered' } })
        ]);

        // Fetch all orders for admin view with filters applied
        const orders = await Order.findAll({
            where: filterConditions, // Apply filter conditions here
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['fullName', 'email'],
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['productName', 'quantity'],
                        }
                    ],
                },
            ],
            limit,
            offset: (currentPage - 1) * limit,
        });

        const totalPages = Math.ceil(totalOrders / limit);

        // Pass the selected date and month to the template for user feedback
        res.render("product/index", {
            title: "Dashboard | Order Your Jersey",
            totalOrders,
            canceledOrders,
            deliveringOrders,
            deliveredOrders,
            orders,
            currentPage,
            totalPages,
            limit,
            selectedDate: date,  // Send selected date to the view
            selectedMonth: month, // Send selected month to the view
            showSidebar: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};




exports.getAdminUpdateOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const updatedData = req.body; 

    try {
        await Order.update(updatedData, { where: { id: orderId } });
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send("Internal Server Error");
    }
  };


  exports.getAdminDeleteOrder = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        await Order.destroy({ where: { id: orderId } });
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send("Internal Server Error");
    }
  };


  






