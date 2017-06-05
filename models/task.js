const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Collection = require('./collection');

var taskSchema = new Schema ({
  name: String,
  isComplete: Boolean,
  progress: Number,
  collections: {type: Schema.Types.ObjectId, ref: 'Collection'},
  users: [{type: Schema.Types.ObjectId, ref: 'User' }],
});

var task = mongoose.model('task', taskSchema);
module.exports = task;
