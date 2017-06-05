const db = require('../models/task');
const collection = require('../models/collection');
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
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    if (decoded) {
      if (req.body.collection) {
        collection.find({name:req.body.collection, users:decoded.id}, (err,coll) => {
          console.log(req.body.collection);
          console.log(coll.length);
          if (coll.length > 0) {
            let newData = new db ({
              name: req.body.name,
              isComplete: false,
              progress: 0,
              users: decoded.id,
              collections: coll.id
            });
            newData.save((err, createdData) => {
              res.send(err ? err : `Task is successfully created`);
            });
          }
          else {
            let newCollection = new collection({
              name: req.body.collection,
              users: decoded.id,
            });
            newCollection.save((err, createdCollection) => {
              let newData = new db({
                name: req.body.name,
                isComplete: false,
                progress: 0,
                users: decoded.id,
                collections: createdCollection.id
              });
              newData.save((err, createdData) => {
                res.send(err ? err : `Task and collection are successfully created`);
              });
            });
          }
        });
      }
      else {
        collection.find({name:'Uncategorized', users:decoded.id}, (err, coll) => {
          let newData = new db ({
            name: req.body.name,
            isComplete: false,
            progress: 0,
            users: decoded.id,
            collections: coll.id
          });
          newData.save((err, createdData) => {
            res.send(err ? err : `Task is successfully created`);
          });
        });
      }
    }
    else {
      res.send('Please signin/signup');
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

var showByUser = ((req,res) => {
  let token = req.headers.token;
  jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
    if (decoded) {
      if(decoded.role === "admin") {
        let userId = req.params.userId;
        db.find({users:userId}, (err,data) => {
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

var showByCollection = ((req,res) => {
  let collId = req.params.collId;
  db.find({collections:collId}, (err,data) => {
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
    datum.isComplete = req.body.isComplete || datum.isComplete;
    datum.progress = req.body.progress || datum.progress;
    datum.collections = req.body.collection || datum.collections;
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
  showByCollection,
  destroy,
  update,
  destroyUser
};
