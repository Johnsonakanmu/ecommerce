const router = require('express').Router();
const productController = require('../controllers/productController')
const upload = require('../../middleware/upload')
// const {verifyToken} = require('../../server/routes/verifyToken')

router.get('/dashboard',  productController.homePage)
router.get('/product_list', productController.listView)
router.get('/add_product', productController.addProducts)
router.post('/add_product',  upload,   productController.addProduct)
router.get('/product_detail/:id', productController.productDetail)

router.get('/edit_product/:id', productController.getEditProductPage)
router.post('/update/:id', upload, productController.updateProduct);



// For forms using POST but simulating DELETE using method-override
router.post('/delete/:id', productController.deleteProduct);
router.delete('/delete/:id', productController.deleteProduct);

router.post('/updateSoldAmount/:id', productController.updateProductSoldAmount);

module.exports = router