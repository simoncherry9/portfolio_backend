const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const { verifyAdminToken, loginUser } = require('../../middlewares/adminAuth');

router.post('/users', UsersController.createUser);
router.post('/login', UsersController.loginUser);
router.get('/users', UsersController.getAllUsers);
router.get('/users/:username', UsersController.getUser); // Cambio en esta ruta
router.put('/users/:username', loginUser, UsersController.editUser);


router.delete('/users/:username', UsersController.deleteUser); // Cambio en esta ruta

module.exports = router;
