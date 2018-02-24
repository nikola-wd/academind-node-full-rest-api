const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('-__v') // we want to get all props except for __v
    // .populate('product') // will populate with product data, and will get all product data if empty
    .populate('product', 'name') // now we will get only name, and _id from @1
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product, // this needs to be here so that the populate can work, @1 this is where we get id from
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${doc._id}`
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({ err }); // err: err es6
    });
};





exports.orders_create_order = (req, res, next) => {
  // checking if we have product id in DB, we can't create an order for product that doesn't exist in DB
  Product.findById(req.body.productId)
    .then(product => {
      // if product with passed id exist in DB, then create new order
      if (!product) { // not working for some reason, code below do exec
        return res.status(404).json({
          message: 'Product was not found'
        });
      }
      // since we return ^, code below will not run if product's not found
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save(); // returning so that we don't nest too much but do .then().then()
    })
    .then(result => {
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`
        }
      });
    })
    .catch(err => {
      // prod not in DB
      res.status(500).json({
        message: 'Product not found',
        err // err: err es6
      });
    });
};



exports.orders_get_one = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product') // here we will get all product data and populate to product prop of found order
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      res.status(200).json({
        order, // order: order es6
        request: {
          type: 'GET',
          description: 'GET_ALL_ORDERS',
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};





exports.orders_delete_one = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          description: 'CREATE_NEW_ORDER',
          url: 'http://localhost:3000/orders',
          body: {
            productId: 'ID',
            quantity: "Number"
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ err });
    })
};