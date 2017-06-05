const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: String,
  password: String,
  name: String,
  email: String,
  role: String
});

var user = mongoose.model('user', userSchema);
module.exports = user;
