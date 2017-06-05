const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

var collectionSchema = new Schema ({
  name: String,
  users: [{type: Schema.Types.ObjectId, ref: 'User' }],
});

var collection = mongoose.model('collection', collectionSchema);
module.exports = collection;
