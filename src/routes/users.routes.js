const express = require('express');
const UsersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/users', UsersController.createUser);

module.exports = router;
