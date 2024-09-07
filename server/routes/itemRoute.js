const router = require('express').Router();
const itemController = require('../controllers/itemController')


router.get('/', itemController.itemsList);
router.get('/cart', itemController.getCart);
router.post('/cart', itemController.postCart);

router.get('/check_out', itemController.checkOut);
router.get('/search', itemController.searchItem);

module.exports = router