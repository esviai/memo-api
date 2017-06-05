const router = require('express').Router();
const user = require('../controllers/users');
const collection = require('../controllers/collections');
const task = require('../controllers/tasks');

router.use(user.authorization);

router.get('/users', user.showAll);
router.get('/users/:id', user.showOne);
router.post('/users', user.create);
router.delete('/users/:id', user.destroy);
router.put('/users/:id', user.update);

router.post('/collections', collection.create);
router.get('/collections', collection.showAll);
router.get('/collections/:id', collection.showOne);
router.get('/collections/user/:userId', collection.showByUser);
router.delete('/collections/:id', collection.destroy);
router.put('/collections/user/:id', collection.destroyUser);
router.put('/collections/:id', collection.update);

router.post('/tasks', task.create);
router.get('/tasks', task.showAll);
router.get('/tasks/:id', task.showOne);
router.get('/tasks/user/:userId', task.showByUser);
router.get('/tasks/collection/:collId', task.showByCollection);
router.delete('/tasks/:id', task.destroy);
router.put('/tasks/user/:id', task.destroyUser);
router.put('/tasks/:id', task.update);


module.exports = router;
