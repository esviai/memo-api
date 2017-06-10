const router = require('express').Router();
const user = require('../controllers/users');

router.use('/', user.authentication);
router.use('/:id', user.authorization);

router.get('/', user.showAll);
router.get('/:id', user.showOne);
router.put('/:id', user.update);
router.delete('/:id', user.destroy);

module.exports = router;
