const router = require('express').Router();
const collection = require('../controllers/collections');

router.post('/', collection.create);
router.get('/', collection.showByUser);
router.get('/:id', collection.authentication, collection.showOne);
router.put('/:id', collection.ownerAuthentication, collection.update);
router.delete('/:id', collection.ownerAuthentication, collection.destroy);

module.exports = router;
