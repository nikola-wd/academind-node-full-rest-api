const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, 
    required: true, 
    unique: true, // unique doesn't validate but it still improves indexing in db if it knows it's unique
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }, 
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
// test@test.com password: password && test2@test.com