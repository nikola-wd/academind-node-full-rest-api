const express = require('express');
const app = express();
const morgan = require('morgan');
app.use('/uploads', express.static('uploads')); // so that uploaded images are publicly available, and apply this middleware only if uploads folder is present in url
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// connect to DB
mongoose.connect('mongodb://' + process.env.MONGO_ATLAS_USERNAME +':'+ process.env.MONGO_ATLAS_PW + '@' + process.env.MONGO_ATLAS_DB);
mongoose.Promise = global.Promise;


// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setting CORS
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://specific-site.com'); // only http://specific-site.com has access
  // res.header('Access-Control-Allow-Headers', '*'); // all headers
  res.header('Access-Control-Allow-Origin', '*'); // * gives access to any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // what we support for our API
    return res.status(200).json({});
  }
  next();
});


// ROUTES that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// ERROR HANDLING
// 404 error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// handle errors (404 or any other error from app) (no route ^ was able to handle req)
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});



module.exports = app;