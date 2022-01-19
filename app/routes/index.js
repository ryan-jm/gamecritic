const router = require('express').Router();
const categoriesRouter = require('./categories');
const commentsRouter = require('./comments');
const reviewsRouter = require('./reviews');
const usersRouter = require('./users');
const NCGamesAPI = require('../endpoints.json');

router.get('/', (req, res, next) => {
  res.status(200).send({ NCGamesAPI });
});

router.use('/categories', categoriesRouter);
router.use('/comments', commentsRouter);
router.use('/reviews', reviewsRouter);
router.use('/users', usersRouter);

module.exports = router;
