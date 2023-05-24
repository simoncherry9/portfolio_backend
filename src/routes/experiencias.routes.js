const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ExperienciasController = require('../controllers/experiencias.controller');
const { verifyAdminToken } = require('../../middlewares/adminAuth');

router.post('/experiencias', verifyAdminToken, ExperienciasController.createExperiencia);

module.exports = router;
