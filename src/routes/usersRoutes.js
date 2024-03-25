const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController.js')

router.post('/register', usersController.addUser)
router.post('/login', usersController.loginUser)
router.post('/logout', usersController.logoutUser)

module.exports = router;