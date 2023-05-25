const pool = require('../../DB');

// Método para crear un formulario
async function createForm(req, res) {
    const { nombre, email, mensaje } = req.body;

    const query = 'INSERT INTO formularios (nombre, email, mensaje) VALUES (?, ?, ?)';
    const values = [nombre, email, mensaje];

    try {
        await pool.query(query, values);
        console.log(` > FORMULARIO > CREAR-----> FORMULARIO CREADO`)
        res.json("Formulario creado con exito");
    } catch (error) {
        console.error('> FORMULARIO > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear el formulario' });
    }
}

// Método para obtener todos los formularios
async function getFormularios(req, res) {
    const query = 'SELECT * FROM formularios';

    try {
        const [rows] = await pool.query(query);
        console.log("> FORMULARIOS > OBTENER -----> FORMULARIOS OBTENIDOS")
        res.json({ formularios: rows });
    } catch (error) {
        console.error('> FORMULARIOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener los formularios' });
    }
}

// Método para obtener un formulario por su ID
async function getFormsById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM formularios WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> FORMULARIOS > OBTENERxID -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log(`> FORMULARIOS > OBTENERxID -----> FORMULARIO OBTENIDO`)
        res.json({ formulario: rows[0] });
    } catch (error) {
        console.error('> FORMULARIOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener el formulario' });
    }
}

// Método para editar un formulario por su ID
async function editForm(req, res) {
    const { id } = req.params;
    const { nombre, email, mensaje } = req.body;

    const query = 'UPDATE formularios SET nombre = ?, email = ?, mensaje = ? WHERE id = ?';
    const values = [nombre, email, mensaje, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> FORMULARIOS > EDITARxID -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log("> FORMULARIOS > EDITAR -----> FORMULARIO EDITADO")
        res.json("Formulario editado con exito");
    } catch (error) {
        console.error('> FORMULARIO > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar el formulario' });
    }
}

// Método para eliminar un formulario por su ID
async function deleteForm(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM formularios WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> FORMULARIOS > ELIMINAR -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log("> FORMULARIOS > ELIMINAR -----> FORMULARIO ELIMINADO")
        res.json("Formulario eliminado de manera exitosa");
    } catch (error) {
        console.error('"> FORMULARIOS > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar el formulario' });
    }
}

module.exports = {
    createForm,
    getFormularios,
    getFormsById,
    editForm,
    deleteForm
};
