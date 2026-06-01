const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
} = require('../controllers/productController');

router.get('/dashboard', getDashboardStats);
router.route('/').get(getProducts).post(upload.single('image'), createProduct);
router.route('/:id').get(getProduct).put(upload.single('image'), updateProduct).delete(deleteProduct);

module.exports = router;
