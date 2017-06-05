"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memos');

const index = require('./routes/index');
const admin = require('./routes/admin');
const users = require('./routes/users');
const collections = require('./routes/collections');
const tasks = require('./routes/tasks');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', index);
app.use('/admin', admin);
app.use ('/api/users/', users);
app.use ('/api/collections/', collections);
app.use ('/api/tasks/', tasks);

app.listen(3000);
