const { getCurrentWinner } = require('../controllers/raffle');
const { protectplayer } = require('../middleware/middleware');

const router = require('express').Router();

router
    .get('/getcurrentwinner', protectplayer, getCurrentWinner);

module.exports = router;