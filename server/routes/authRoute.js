const router = require('express').Router();
const authController = require('../controllers/authController')


router.get('/', authController.loginPage);
router.post('/dashboard', authController.loginPages);

router.post('/signup', authController.signupPage);
router.get('/reset_password', authController.resetPassword);




module.exports = router