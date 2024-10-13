const router = require('express').Router();
const authController = require('../controllers/authController')


router.get('/login', authController.loginPage);
router.post('/login', authController.loginPages);

router.post('/signup', authController.signupPage);
router.get('/reset_password', authController.resetPassword);




module.exports = router