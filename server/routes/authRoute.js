const router = require('express').Router();
const authController = require('../controllers/authController')


router.get('/login', authController.loginPage);
router.get('/signup', authController.signupPage);
router.get('/reset_password', authController.resetPassword);




module.exports = router