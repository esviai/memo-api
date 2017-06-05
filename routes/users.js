const router = require('express').Router();
const user = require('../controllers/users');

router.get('/:id', user.authentication, user.showOne);
router.put('/:id', user.authentication, user.changePass);

module.exports = router;
