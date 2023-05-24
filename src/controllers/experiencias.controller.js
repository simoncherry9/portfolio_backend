const Experience = require('../models/experiencias.model');

class ExperienciasController {
    static async createExperiencia(req, res) {
        const { compañia, puesto, descripcion, fechaFin } = req.body;

        try {
            const experienciaId = await Experience.create({
                compañia,
                puesto,
                descripcion,
                fechaFin,
            });

            res.json({ message: 'Experiencia laboral creada', experienciaId });
        } catch (error) {
            console.error('Error al crear la experiencia laboral:', error);
            res.status(500).json({ error: 'Error interno al intentar crear la experiencia laboral' });
        }
    }
}

module.exports = ExperienciasController;
