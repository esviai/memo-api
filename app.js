"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const dotenvConfig = require('dotenv').config();
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/memos');
mongoose.connect(process.env.MONGOLAB_URI);
const port = process.env.PORT || 3000;

const index = require('./routes/index');
const users = require('./routes/users');
const memos = require('./routes/memos');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', index);
app.use ('/api/users/', users);
app.use ('/api/memos/', memos);

app.listen(port, function() {
  console.log('Server started on ' + port)
})

