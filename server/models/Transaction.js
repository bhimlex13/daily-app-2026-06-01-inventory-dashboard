const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtSale: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  items: {
    type: [transactionItemSchema],
    required: true,
    validate: [v => v.length > 0, 'Transaction must have at least one item']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'other'],
    default: 'cash'
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
