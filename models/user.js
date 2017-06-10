const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: {
    type: String,
    minlength: [5, '{PATH} should not be less than five characters'],
    required: [true, '{PATH} should not be empty'],
    unique: true
  },
  email: {
    type: String,
    validate: {
      validator: function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      },
      message: '{VALUE} is not a valid email.'
    },
    required: [true, '{PATH} should not be empty'],
    unique: true
  },
  name: {
    type: String,
    required: [true, '{PATH} should not be empty']
  },
  password: {
    type: String,
    minlength: [8, '{PATH} should not be less than eight characters'],
    required: [true, '{PATH} should not be empty']
  },
});

var user = mongoose.model('user', userSchema);
module.exports = user;
