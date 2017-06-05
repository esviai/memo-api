const router = require('express').Router();
const user = require('../controllers/users');

router.post('/signin', user.signIn);
router.post('/signup', user.signUp);

module.exports = router;
