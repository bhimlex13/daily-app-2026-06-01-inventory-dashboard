const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;
