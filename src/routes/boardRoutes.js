const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController')

router.post('/checkWords', boardController.checkWords)

module.exports = router;