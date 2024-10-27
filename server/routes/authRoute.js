const router = require('express').Router();
const authController = require('../controllers/authController')


// router.get('/login', authController.loginPage);
// router.post('/login', authController.loginPages);



router.get('/login', authController.getLoginAccount);
router.post('/login', authController.loginAccount);

router.post('/signup', authController.signupPage);
router.get('/reset_password', authController.resetPassword);




module.exports = router