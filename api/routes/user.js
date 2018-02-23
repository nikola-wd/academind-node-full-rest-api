const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/signup', (req, res, next) => {
  // check if email is already registered
  User.find({ email: req.body.email})
    .exec()
    .then(user => {
      // if email exists in db
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'This email address is taken. Please choose another one.'
        })
      } else {
        // email address is not taken
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({ err });
              });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});



router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email }) // there is also findOne() method, find() returns an array
    .exec()
    .then(user => { // if email is not found in db
      if (user.length < 1) { // 401 - unauthorized (not 404 because we don't want to expose which emails are in db)
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      // if email exists, compare passwords
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        // if there was an error, this doesn't mean if pwds didn't match, that is checked at the end if all these fail
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        // if resutlt is true then passwords match
        if (result) {
          // if user signed in create jwt token
          const token = jwt.sign(
            { // 2 values that we put in jwt token
              email: user[0].email,
              userId: user[0]._id
            }, 
            process.env.JWT_KEY, // private key defined in nodemon.json
            { // options
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        // passwords didn't match
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});


router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});


module.exports = router;