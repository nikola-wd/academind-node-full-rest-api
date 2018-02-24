const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');


// CREATE NEW ACCOUNT
router.post('/signup', UserController.users_user_sign_up);

// LOGIN
router.post('/login', UserController.users_user_login);

// DELETE ONE USER BY ID
router.delete('/:userId', checkAuth, UserController.users_user_delete);


module.exports = router;