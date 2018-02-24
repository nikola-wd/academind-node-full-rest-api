const mongoose = require('mongoose');
const Product = require('../models/product');


exports.products_get_all = (req, res, next) => {
  // Product.find().where().limit();
  Product.find()
    // select() - which fields do we want to get or exclude
    // .select('name price _id')
    .select('-__v')
    .exec()
    .then(docs => {
      // creating some meta fields as well before returning response (count of all docs for example)
      const response = {
        count: docs.length,
        // now docs is an [] of filtered docs (without __v prop)
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            // ...doc,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          }
        })
      };
      // if there are docs in DB
      // if (docs.length >= 0) {
      // res.status(200).json(docs);
      res.status(200).json(response);
      /*       } else {
              res.status(404).json({  // maybe 200 but with msg
                message: 'No entries found'
              });
            } */
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};



exports.products_create_one = (req, res, next) => {
  console.log(req.file);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: `Created product: ${result.name} successfully`,
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id
      },
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${result._id}`
      }
    })
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};




exports.products_read_one = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
      console.log('From DB', doc);
      // if doc is not null, if it exists in DB
      if (doc) {
        // res.status(200).json(doc);
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'SEE_ALL_PRODUCTS',
            url: 'http://localhost:3000/products'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};





exports.products_update_one = (req, res, next) => {
  const id = req.params.productId;       // we still wanna use the same ID, so not updating that
  const updateOps = {};
  // check what we are updating (we don't need to change all props of obj)
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  // Product.update({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice } });
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: `Product: ${id} updated successfully`,
        request: {
          type: 'GET',
          description: 'SEE_DETAILS_OF_THIS_PRODUCT',
          url: `http://localhost:3000/products/${id}`
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });

  // SINCE WE ARE LOOPING THROUGH REQ.BODY, WE NEED TO SEND PATCH REQ IN THIS FORMAT
  /*   [
      {
        "propName": "name",
        "value": "Girl with the dragon tattoo"
      }
    ] */
};




exports.products_remove_one = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json({
        massage: `Product with the ID: ${id} deleted`,
        request: {
          type: 'POST',
          description: 'ADD_MORE_PRODUCTS',
          url: 'http://localhost:3000/products'
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};
