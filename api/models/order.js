const mongoose = require('mongoose');

// this orderr is connected to one product
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId, // id of the product, creating relation (which not a great idea, we are not using SQL)
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1 // with default we don't need required
  }
});

module.exports = mongoose.model('Order', orderSchema);