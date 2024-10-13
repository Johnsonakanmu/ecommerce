const router = require('express').Router();
const itemController = require('../controllers/itemController')


router.get('/', itemController.itemsList);
router.get('/cart', itemController.getCart);
router.post('/cart/:productId', itemController.postCart);

router.get('/checkout', itemController.getOrder);
router.post('/checkout', itemController.createOrder);


router.get('/create_account', itemController.getAccount);
router.post('/create_account', itemController.createAccount);

router.get('/shipping_details', itemController.getShippingDetails);
router.post('/shipping_details', itemController.createShippingDetails);


router.get('/search', itemController.searchItem);

router.post('/cart/update/:id', itemController.updateCartItemQuantity);




router.post('/cart/delete/:id', itemController.deleteCartItem);

module.exports = router