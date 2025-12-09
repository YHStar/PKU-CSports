const express = require('express');
const router = express.Router();
const standingController = require('../controllers/standingController');

router.get('/', standingController.listStandings);
router.get('/players', standingController.listPlayerStats);

module.exports = router;

