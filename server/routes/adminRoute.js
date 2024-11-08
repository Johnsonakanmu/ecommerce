const router = require('express').Router();
const adminController = require('../controllers/adminController')
const { isAdminAuthentication } = require('../../utils/isAdminAuthentication')

router.get('/', isAdminAuthentication, adminController.homePage);
router.post('/orders/:id/update', adminController.getAdminUpdateOrder);
router.post('/orders/:id/delete', adminController.getAdminDeleteOrder);

router.get('/sign_in', adminController.adminSignIn);
router.post('/sign_in', adminController.adminSignIns);


module.exports = router


// // Handle 404 errors (catch-all route)