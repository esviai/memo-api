const router = require('express').Router();
const user = require('../controllers/users');

router.get('/', (req,res) => {
  res.send(`I'M ALIVE!`)
})
router.post('/signin', user.signIn);
router.post('/signup', user.create);

module.exports = router;
