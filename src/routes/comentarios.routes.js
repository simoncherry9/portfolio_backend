const express = require('express');
const router = express.Router();
const ComentariosController = require('../controllers/comentarios.controller');
const { verifyAdminToken, loginUser } = require('../../middlewares/adminAuth');

router.post('/comentarios', loginUser, ComentariosController.createComentario);

router.get('/comentarios', ComentariosController.getComentarios);

router.get('/comentarios/:id', ComentariosController.getComentarioById);

router.put('/comentarios/:id', verifyAdminToken, ComentariosController.editComentario);

router.delete('/comentarios/:id', verifyAdminToken, ComentariosController.deleteComentario);

module.exports = router;
