const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.js')

router.post('/users', usersController.addUser)

module.exports = router;