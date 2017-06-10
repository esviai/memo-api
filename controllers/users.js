const db = require('../models/user');
const dotenvConfig = require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

var create = ((req,res) => {
  bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
    let newData = new db ({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    newData.save((err, createdData) => {
      res.send(err ? err : createdData);
    });
  });
});

var signIn = ((req,res) => {
  db.findOne({username:req.body.username}, (err, data) => {
    if (err) res.send(err);
    else {
      if(data) {
        bcrypt.compare(req.body.password, data.password, (err, result) => {
          if (err) res.send(err);
          else {
            if (result) {
              var token = jwt.sign({id: data.id, username: data.username}, process.env.SECRET_KEY);
              res.send(token);
            }
            else {
              res.send('Username/password is wrong');
            }
          }
        });
      }
      else {
        res.send('Username/password is wrong');
      }
    }
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
    res.send(err ? err : `Data is deleted: ${datum}`);
  });
});

var update = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err, datum) => {
    datum.name = req.body.name || datum.name;
    datum.username = req.body.username || datum.username;
    datum.password = req.body.password || datum.password;
    datum.email = req.body.email || datum.email;
    datum.role = req.body.role || datum.role;
    datum.save((err,updatedData) => {
      res.send(err ? err : updatedData);
    });
  });
});

var changePass = ((req,res) => {
  let id = req.params.id;
  db.findByIdAndUpdate(id, {name: req.body.name, password: req.body.password}, (err,datum) => {
    res.send(err ? err : `Data is updated: ${datum}`);
  });
});

var authentication = ((req, res, next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(decoded) {
      next ();
    }
    else {
      res.send('You are not authenticated');
    }
  });
});

var authorization = ((req, res, next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (decoded.id === req.params.id) next ();
    else {
      res.send('You are not authorized to do the operation');
    }
  });
});

module.exports = {
  authentication,
  signIn,
  showOne,
  authorization,
  create,
  showAll,
  destroy,
  update,
};
