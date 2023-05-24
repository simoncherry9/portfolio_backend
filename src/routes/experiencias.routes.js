const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ExperienciasController = require('../controllers/experiencias.controller');

function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> EXPERIENCIA LABORAL > CREAR -----> ERROR -----> NO SE DETECTO TOKEN ----->", err);
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, process.env.SECRET_KEY, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            console.log("> EXPERIENCIA LABORAL > CREAR -----> ERROR -----> TOKEN DE AUTENTICACION IVALIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' });
        }

        if (decoded.role !== 'admin') {
            console.log("> EXPERIENCIA LABORAL > CREAR -----> ERROR -----> ACCESO NO AUTORIZADO ----->", err);
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        req.user = decoded;
        next();
    });
}

router.post('/experiencias', verifyAdminToken, ExperienciasController.createExperiencia);

module.exports = router;
