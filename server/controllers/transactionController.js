const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Process a new transaction (checkout)
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { items, paymentMethod, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in transaction' });
    }

    let totalAmount = 0;
    const processedItems = [];

    // Verify stock and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }
      
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}`);
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save(); // The pre-save hook will update the 'status' automatically

      totalAmount += item.priceAtSale * item.quantity;
      processedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale
      });
    }

    // Create transaction record
    const transaction = await Transaction.create([{
      items: processedItems,
      totalAmount,
      paymentMethod,
      customerName
    }]);

    res.status(201).json({
      success: true,
      data: transaction[0]
    });

  } catch (error) {
    console.error('Transaction failed:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Transaction failed'
    });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
