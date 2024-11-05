const router = require('express').Router();
const itemController = require('../controllers/itemController')


router.get('/', itemController.itemsList);
router.get('/cart', itemController.getCart);
router.post('/cart/:productId', itemController.addToCart);

router.get('/create_account', itemController.getAccount);
router.post('/create_account', itemController.createAccount);
router.get('/edit_account', itemController.editCreateAccount);

router.get('/shipping_details', itemController.getShippingDetails);

router.get('/search', itemController.searchItem);

router.post('/cart/update/:id', itemController.updateCartItemQuantity);
router.post('/cart/delete/:id', itemController.deleteCartItem);

router.get('/confirmation_page', itemController.getConfirmation );

router.get('/checkout', itemController.getOrder);
router.post('/checkout', itemController.createOrder);

router.post('/verify-payment', itemController.verifyPayments);


router.get('/transaction_success', itemController.getTransactionSuccess);
router.get('/transaction_failed', itemController.getTransactionFailed);




module.exports = router