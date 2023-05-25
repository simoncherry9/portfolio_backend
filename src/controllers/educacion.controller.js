const pool = require('../../DB');

// Método para crear una educacion
async function createEducacion(req, res) {
    const { establecimiento, nivel, fechaFin } = req.body;

    const query = 'INSERT INTO educacion (establecimiento, nivel, fechaFin) VALUES (?, ?, ?)';
    const values = [establecimiento, nivel, fechaFin];

    try {
        await pool.query(query, values);
        console.log(`> EDUCACION > CREAR-----> EDUCACION CREADA`)
        res.json("Educacion creada con exito");
    } catch (error) {
        console.error('> EDUCACION > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear la educacion', error });
    }
}

// Método para obtener todas las educaciones
async function getEducaciones(req, res) {
    const query = 'SELECT * FROM educacion';

    try {
        const [rows] = await pool.query(query);
        console.log("> EDUCACION > OBTENER -----> EDUCACIONES OBTENIDAS")
        res.json({ educaciones: rows });
    } catch (error) {
        console.error('> EDUCACION > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener las educaciones', error });
    }
}

// Método para obtener una educacion por su ID
async function getEducacionById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM educacion WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> EDUCACION > OBTENERxID -----> EDUCACION NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Educacion no encontrada', error });
        }
        console.log(`> EDUCACION > OBTENERxID -----> EDUCACION OBTENIDA`)
        res.json({ educacion: rows[0] });
    } catch (error) {
        console.error('> EDUCACION > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener la educacion', error });
    }
}

// Método para editar una educacion por su ID
async function editEducacion(req, res) {
    const { id } = req.params;
    const { establecimiento, nivel, fechaFin } = req.body;

    const query = 'UPDATE educacion SET establecimiento = ?, nivel = ?, fechaFin = ? WHERE id = ?';
    const values = [establecimiento, nivel, fechaFin, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> EDUCACION > EDITARxID -----> EDUCACION NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Educacion no encontrada', error });
        }
        console.log("> EDUCACION > EDITAR -----> EDUCACION EDITADA")
        res.json("Educacion editada con exito");
    } catch (error) {
        console.error('> EDUCACION > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar la educacion', error });
    }
}

// Método para eliminar una educacion por su ID
async function deleteEducacion(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM educacion WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> EDUCACION > ELIMINAR -----> EDUCACION NO ENCONTRADA -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Educacion no encontrada', error });
        }
        console.log("> EDUCACION > ELIMINAR -----> EDUCACION ELIMINADA")
        res.json("Educacion eliminada de manera exitosa");
    } catch (error) {
        console.error('"> EDUCACION > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar la educacion' });
    }
}

module.exports = {
    createEducacion,
    getEducaciones,
    getEducacionById,
    editEducacion,
    deleteEducacion
};
