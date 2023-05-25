const pool = require('../../DB');

// Método para crear una aptitud
async function createAptitud(req, res) {
    const { nombre, descripcion, porcentaje } = req.body;

    const query = 'INSERT INTO aptitudes (nombre, descripcion, porcentaje) VALUES (?, ?, ?)';
    const values = [nombre, descripcion, porcentaje];

    try {
        await pool.query(query, values);
        console.log(` > APTITUDES > CREAR-----> APTITUD CREADA`)
        res.json("Aptitud creada con exito");
    } catch (error) {
        console.error('> APTITUDES > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear la aptitud' });
    }
}

// Método para obtener todas las aptitudes
async function getAptitudes(req, res) {
    const query = 'SELECT * FROM aptitudes';

    try {
        const [rows] = await pool.query(query);
        console.log("> APTITUDES > OBTENER -----> APTITUDES OBTENIDAS")
        res.json({ aptitudes: rows });
    } catch (error) {
        console.error('> APTITUDES > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener las aptitudes' });
    }
}

// Método para obtener una aptitud por su ID
async function getAptitudesById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM aptitudes WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> APTITUDES > OBTENERxID -----> APTITUD NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Experiencia laboral no encontrada' });
        }
        console.log(`> APTITUDES > OBTENERxID -----> APTITUD OBTENIDA`)
        res.json({ aptitud: rows[0] });
    } catch (error) {
        console.error('> APTITUDES > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener la aptitud' });
    }
}

// Método para editar una aptitud por su ID
async function editAptitud(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, porcentaje } = req.body;

    const query = 'UPDATE aptitudes SET nombre = ?, descripcion = ?, porcentaje = ? WHERE id = ?';
    const values = [nombre, descripcion, porcentaje, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> APTITUDES > EDITARxID -----> APTITUD NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Experiencia laboral no encontrada' });
        }
        console.log("> APTITUDES > EDITAR -----> APTITUD EDITADA")
        res.json("Aptitud editada con exito");
    } catch (error) {
        console.error('> APTITUDES > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar la aptitud' });
    }
}

// Método para eliminar una aptitud por su ID
async function deleteAptitud(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM aptitudes WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> APTITUDES > ELIMINAR -----> APTITUD NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Aptitud no encontrada' });
        }
        console.log("> APTITUDES > ELIMINAR -----> APTITUD ELIMINADA")
        res.json("Aptitud eliminada de manera exitosa");
    } catch (error) {
        console.error('"> APTITUDES > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar la aptitud' });
    }
}

module.exports = {
    createAptitud,
    getAptitudes,
    getAptitudesById,
    editAptitud,
    deleteAptitud
};
