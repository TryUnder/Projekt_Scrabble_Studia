const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController')

router.post('/initializeLetterMap', boardController.initializeLetterMap)
router.post('/checkWords', boardController.checkWords)

module.exports = router;