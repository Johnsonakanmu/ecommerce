const router = require('express').Router();
const itemController = require('../controllers/itemController')


router.get('/items', itemController.itemsList);
router.get('/cart', itemController.getCart);
router.post('/cart/:productId', itemController.postCart);

router.get('/order_checkout', itemController.checkOut);
router.post('/order_checkout', itemController.postOrder)

router.get('/search', itemController.searchItem);

router.post('/cart/update/:id', itemController.updateCartItemQuantity);




router.post('/cart/delete/:id', itemController.deleteCartItem);

module.exports = router