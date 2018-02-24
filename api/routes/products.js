const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth'); // custom JWT authentication verification middleware
const ProductsControllers = require('../controllers/products.js');
// TODO: find a way to resize and optimize images
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // unique image names | replacing : with - as windows doesn't accept : in filenames
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

// custom filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accepting with
    cb(null, true);
  } else {
    // reject a file
    cb(null, false); // this doesn't throw an error
    // cb(new Error('message'), false); // this does
  }
};
                                                 // size in bytes 5MB max
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });
 // will be publicly accessible folder, it will be static folder( as defined in app.js)




// -------------- ROUTES --------------- //

// READ ALL
router.get('/', ProductsControllers.products_get_all);

// CREATE     // comparing jsw tokens   // productImage is the field name
router.post('/', checkAuth, upload.single('productImage'), ProductsControllers.products_create_one);

// READ SINGLE
router.get('/:productId', ProductsControllers.products_read_one);

// UPDATE
router.patch('/:productId', checkAuth, ProductsControllers.products_update_one);

// DELETE
router.delete('/:productId', checkAuth, ProductsControllers.products_remove_one);



module.exports = router;