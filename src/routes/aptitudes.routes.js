const express = require('express');
const router = express.Router();
const AptitudesController = require('../controllers/aptitudes.controller');
const { verifyAdminToken } = require('../../middlewares/adminAuth');

router.post('/aptitudes', verifyAdminToken, AptitudesController.createAptitud);

router.get('/aptitudes', AptitudesController.getAptitudes);

router.get('/aptitudes/:id', AptitudesController.getAptitudesById);

router.put('/aptitudes/:id', verifyAdminToken, AptitudesController.editAptitud);

router.delete('/aptitudes/:id', verifyAdminToken, AptitudesController.deleteAptitud);

module.exports = router;
