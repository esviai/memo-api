const db = require('../models/collection');
const tasks = require('../models/task');
const dotenvConfig = require('dotenv').config();
const jwt = require('jsonwebtoken');

var authentication = ((req,res,next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    if(decoded) {
      db.findById(req.params.id, (err,datum) => {
        if(JSON.stringify(datum.users).includes(decoded.id)) {
          next();
        }
        else {
          res.send(`You are not authenticated`);
        }
      });
    }
    else {
      res.send(`You are not authenticated`);
    }
  });
});

var ownerAuthentication = ((req,res,next) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    if (decoded) {
      db.findById(req.params.id, (err,datum) => {
        if(datum.users.indexOf(decoded.id) === 0) next();
        else res.send(`Please ask the collection owner to do the task`);
      });
    }
    else {
      res.send(`You are not authorized to do the operation`);
    }
  });
});

var create = ((req,res) => {
  let newData = new db ({
    name: req.body.name,
    users: req.body.users,
  });
  newData.save((err, createdData) => {
    res.send(err ? err : `Collection is successfully created`);
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

var showByUser = ((req,res) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    if (decoded) {
      if(decoded.role === "admin") {
        db.find({users:req.params.userId}, (err,data) => {
          res.send(err ? err : data);
        });
      }
      else {
        db.find({users:decoded.id}, (err,data) => {
          res.send(err ? err : data);
        });
      }
    }
    else res.send(`Please signin/signup`);
  });
});

var destroy = ((req,res) => {
  let id = req.params.id;
  db.findByIdAndRemove(id, (err,datum) => {
    tasks.find({collections: id}, (err,tasks) => {
      tasks.forEach((task) => {
        task.findByIdAndRemove(task.id, (err,taskDeleted) => {
          console.log(`Task is deleted since collsection is being deleted`);
        });
      });
    });
  });
});

var update = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err, datum) => {
    datum.name = req.body.name || datum.name;
    if (Array.isArray(req.body.users)) {
      req.body.users.forEach(user => {
        if(!JSON.stringify(datum.users).includes(user)) {
          datum.users.push(user);
        }
      });
    }
    else {
      if(!JSON.stringify(datum.users).includes(req.body.users)) {
        datum.users.push(req.body.users);
      }
    }
    datum.save((err,updatedData) => {
      res.send(err ? err : updatedData);
    });
  });
});

var destroyUser = ((req,res) => {
  let id = req.params.id;
  db.findById(id, (err,datum) => {
    if(datum.users.length === 1) {
      res.send(`You can't delete the user, only the owner is left`);
    }
    else {
      let idx = datum.users(indexOf(req.body.userId));
      if (idx > 0) {
        datum.users.slice(idx,1);
        res.send(`user is deleted from the collection`);
      }
      else {
        res.send(`user doesn't have access to the collection`);
      };
    }
  });
});

module.exports = {
  authentication,
  ownerAuthentication,
  create,
  showOne,
  showAll,
  showByUser,
  destroy,
  update,
  destroyUser
};
