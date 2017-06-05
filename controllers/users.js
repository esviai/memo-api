// PR: Saat user dihapus, hapus user di setiap collection dan task juga. Harus pake ngeloop. Callbacknya gimana hayoooo??! Kalau cuma tersisa satu user dan user itu dihapus, berarti collection dan tasknya ikut dihapus juga //

const db = require('../models/user');
const collection = require('../models/collection');
const dotenvConfig = require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

var authentication = ((req, res, next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(decoded) {
      if (decoded.id === req.params.id) next ();
      else {
        res.send('You are not authenticated');
      }
    }
    else {
      res.send('You are not authenticated');
    }
  });
});

var signUp = ((req,res) => {
  bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
    let newData = new db ({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: `user`
    });
    newData.save((err, createdData) => {
      if (err) res.send(err);
      else {
        let newCollection = new collection ({
          name: "Uncategorized",
          users: newData.id,
        });
        newCollection.save((err,createdCollection) => {
          res.send(err ? err : `User and collection are successfully created`);
        });
      }
    });
  });
});

var signIn = ((req,res) => {
  db.findOne({username:req.body.username}, (err, data) => {
    if (err)  res.send(err);
    else {
      if(data) {
        bcrypt.compare(req.body.password, data.password, (err, result) => {
          if (err) res.send(err);
          else {
            if (result) {
              var token = jwt.sign({id: data.id, username: data.username, role: data.role}, process.env.SECRET_KEY);
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

var showOne = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err,datum) => {
    res.send(err ? err : datum);
  });
});

var changePass = ((req,res) => {
  let id = req.params.id;
  db.findByIdAndUpdate(id, {password: req.body.password}, (err,datum) => {
    res.send(err ? err : `Data is updated: ${datum}`);
  });
});

var authorization = ((req, res, next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(decoded) {
      if (decoded.role === "admin") next ();
      else {
        res.send('You are not authorized to do the operation');
      }
    }
    else {
      res.send('You are not authorized to do the operation');
    }
  });
});

var create = ((req,res) => {
  bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
    console.log(req.body.password);
    console.log(hash);
    let newData = new db ({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role
    });
    console.log(newData.password);
    newData.save((err, createdData) => {
      if (err) res.send(err);
      else {
        let newCollection = new collection ({
          name: "Uncategorized",
          users: newData.id,
        });
        newCollection.save((err,createdCollection) => {
          res.send(err ? err : `User and collection are successfully created`);
        });
      }
    });
  });
});

var showAll = ((req,res) => {
  db.find((err, data) => {
    res.send(err ? err : data);
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

module.exports = {
  authentication,
  signUp,
  signIn,
  showOne,
  changePass,
  authorization,
  create,
  showAll,
  destroy,
  update,
};
