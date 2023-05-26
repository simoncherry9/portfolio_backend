const express = require('express');
const router = express.Router();
const ProyectosController = require('../controllers/proyectos.controller');
const { verifyAdminToken } = require('../../middlewares/adminAuth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/proyectos', verifyAdminToken, ProyectosController.createProyecto);

router.get('/proyectos', ProyectosController.getProyectos);

router.get('/proyectos/:id', ProyectosController.getProyectosById);

router.put('/proyectos/:id', verifyAdminToken, ProyectosController.editProyecto);

router.delete('/proyectos/:id', verifyAdminToken, ProyectosController.deleteProyecto);

module.exports = router;