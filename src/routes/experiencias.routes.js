const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ExperienciasController = require('../controllers/experiencias.controller');
const { verifyAdminToken } = require('../../middlewares/adminAuth');

router.post('/experiencias', verifyAdminToken, ExperienciasController.createExperiencia);

router.get('/experiencias', ExperienciasController.getExperiencias);

router.get('/experiencias/:id', ExperienciasController.getExperienciaById);

router.put('/experiencias/:id', verifyAdminToken, ExperienciasController.editExperiencia);

router.delete('/experiencias/:id', verifyAdminToken, ExperienciasController.deleteExperiencia);

module.exports = router;
