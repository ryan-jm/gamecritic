const router = require('express').Router();

const categories = require('./categories');
const comments = require('./comments');
const reviews = require('./reviews');
const NCGamesAPI = require('../info');

router.get('/', (req, res, next) => {
  res.status(200).send({ NCGamesAPI });
});

router.use('/categories', categories);
router.use('/comments', comments);
router.use('/reviews', reviews);

module.exports = router;
