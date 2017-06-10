const db = require('../models/memo');
const dotenvConfig = require('dotenv').config();
const jwt = require('jsonwebtoken');

var create = ((req,res) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    let newData = new db ({
      title: req.body.title,
      content: req.body.content,
      creator: decoded.id
    });
    newData.save((err, createdData) => {
      res.send(err ? err : createdData);
    });
  });
});

var showAll = ((req,res) => {
  db.find((err, data) => {
    res.send(err ? err : data);
  });
});

var showOne = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err,datum) => {
    res.send(err ? err : datum);
  });
});

var destroy = ((req,res) => {
  let id = req.params.id;
  db.findByIdAndRemove(id, (err,datum) => {
    res.send(err ? err : datum);
  });
});

var update = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err, datum) => {
    datum.title = req.body.title || datum.title;
    datum.content = req.body.content || datum.content;
    datum.save((err,updatedData) => {
      res.send(err ? err : updatedData);
    });
  });
});

var authorization = ((req, res, next) => {
  let token = req.headers.token;
  let id = req.params.id;
  db.findById(id, (err, datum) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded.id == datum.creator) next ();
      else {
        res.send('You are not authorized to do the operation');
      }
    });

  });
});

module.exports = {
  create,
  showOne,
  showAll,
  destroy,
  update,
  authorization
};
