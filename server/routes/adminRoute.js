const router = require('express').Router();
const adminController = require('../controllers/adminController')


router.get('/dashboard',  adminController.homePage)
router.post('/orders/:id/update', adminController.getAdminUpdateOrder);
router.post('/orders/:id/delete', adminController.getAdminDeleteOrder);










module.exports = router