const express = require('express');
const router = express.Router();
const EducacionController = require('../controllers/educacion.controller');
const { verifyAdminToken } = require('../../middlewares/adminAuth');

router.post('/educacion', verifyAdminToken, EducacionController.createEducacion);

router.get('/educacion', EducacionController.getEducaciones);

router.get('/educacion/:id', EducacionController.getEducacionById);

router.put('/educacion/:id', verifyAdminToken, EducacionController.editEducacion);

router.delete('/educacion/:id', verifyAdminToken, EducacionController.deleteEducacion);

module.exports = router;
