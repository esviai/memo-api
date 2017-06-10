const router = require('express').Router();
const task = require('../controllers/tasks');

router.post('/', task.create);
router.get('/', task.showByUser);
router.get('/collection/:collId', task.showByCollection);
router.get('/:id', task.authentication, task.showOne);
router.put('/:id', task.ownerAuthentication, task.update);
router.delete('/:id', task.ownerAuthentication, task.destroy);

module.exports = router;
