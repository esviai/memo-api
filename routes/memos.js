const router = require('express').Router();
const memo = require('../controllers/memos');
const user = require('../controllers/users');

router.use('/', user.authentication);
router.use('/:id', memo.authorization);

router.post('/', memo.create);
router.get('/', memo.showAll);
router.get('/:id', memo.showOne);
router.put('/:id', memo.update);
router.delete('/:id', memo.destroy);

module.exports = router;
