const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController.js')

router.post('/register', usersController.addUser)
router.post('/login', usersController.loginUser)

module.exports = router;