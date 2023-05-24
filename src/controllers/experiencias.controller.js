const pool = require('../../DB');

// Método para crear una experiencia laboral
async function createExperiencia(req, res) {
    const { compañia, puesto, descripcion, fechaFin } = req.body;

    const query = 'INSERT INTO experiencias (compañia, puesto, descripcion, fechaFin) VALUES (?, ?, ?, ?)';
    const values = [compañia, puesto, descripcion, fechaFin];

    try {
        await pool.query(query, values);
        console.log(` > EXPERIENCIA > CREAR-----> EXPERIENCIA EN CREADA`)
        res.json("Experiencia creada con exito");
    } catch (error) {
        console.error('> EXPERIENCIA > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear la experiencia laboral' });
    }
}

// Método para obtener todas las experiencias laborales
async function getExperiencias(req, res) {
    const query = 'SELECT * FROM experiencias';

    try {
        const [rows] = await pool.query(query);
        console.log("> EXPERIENCIA > OBTENER -----> EXPERIENCIAS OBTENIDAS")
        res.json({ experiencias: rows });
    } catch (error) {
        console.error('> EXPERIENCIA > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener las experiencias laborales' });
    }
}

// Método para obtener una experiencia laboral por su ID
async function getExperienciaById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM experiencias WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> EXPERIENCIA > OBTENERxID -----> EXPERIENCIA NO ENCONTRADA -----> ERROR -----> ")
            return res.status(404).json({ error: 'Experiencia laboral no encontrada' });
        }
        console.log(`> EXPERIENCIA > OBTENERxID -----> EXPERIENCIA OBTENIDA`)
        res.json({ experiencia: rows[0] });
    } catch (error) {
        console.error('> EXPERIENCIA > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener la experiencia laboral' });
    }
}

// Método para editar una experiencia laboral por su ID
async function editExperiencia(req, res) {
    const { id } = req.params;
    const { compañia, puesto, descripcion, fechaFin } = req.body;

    const query = 'UPDATE experiencias SET compañia = ?, puesto = ?, descripcion = ?, fechaFin = ? WHERE id = ?';
    const values = [compañia, puesto, descripcion, fechaFin, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> EXPERIENCIA > EDITARxID -----> EXPERIENCIA NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Experiencia laboral no encontrada' });
        }
        console.log("> EXPERIENCIA > EDITAR -----> EXPERIENCIA EDITADA")
        res.json("Experiencia editada con exito");
    } catch (error) {
        console.error('> EXPERIENCIA > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar la experiencia laboral' });
    }
}

// Método para eliminar una experiencia laboral por su ID
async function deleteExperiencia(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM experiencias WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> EXPERIENCIA > ELIMINAR -----> EXPERIENCIA NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Experiencia laboral no encontrada' });
        }
        console.log("> EXPERIENCIA > ELIMINAR -----> EXPERIENCIA ELIMINADA")
        res.json("Experiencia eliminada de manera exitosa");
    } catch (error) {
        console.error('"> EXPERIENCIA > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar la experiencia laboral' });
    }
}

module.exports = {
    createExperiencia,
    getExperiencias,
    getExperienciaById,
    editExperiencia,
    deleteExperiencia
};
