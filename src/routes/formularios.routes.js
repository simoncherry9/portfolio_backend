const express = require('express');
const router = express.Router();
const FormulariosController = require('../controllers/formularios.controller');
const { verifyAdminToken, loginUser } = require('../../middlewares/adminAuth');

router.post('/formularios', loginUser, FormulariosController.createForm);

router.get('/formularios', verifyAdminToken, FormulariosController.getFormularios);

router.get('/formularios/:id', verifyAdminToken, FormulariosController.getFormsById);

router.put('/formularios/:id', verifyAdminToken, FormulariosController.editForm);

router.delete('/formularios/:id', verifyAdminToken, FormulariosController.deleteForm);

module.exports = router;
