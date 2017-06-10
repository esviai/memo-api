const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

var memoSchema = new Schema ({
  title: {
    type: String,
    required: [true, '{PATH} should not be empty']
  },
  content: {
    type: String,
    required: [true, '{PATH} should not be empty'],
    unique: true
  },
  creator: {
    type: Schema.Types.ObjectId, ref: 'user'
  }
});

var memo = mongoose.model('memo', memoSchema);
module.exports = memo;
