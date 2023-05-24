const express = require('express');
const UsersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/users', UsersController.createUser);
router.post('/login', UsersController.loginUser);

module.exports = router;
