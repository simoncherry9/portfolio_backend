const pool = require('../../DB');

// Método para crear un comentario
async function createComentario(req, res) {
    const { comentario, titulo } = req.body;

    const query = 'INSERT INTO comentarios (comentario, titulo) VALUES (?, ?)';
    const values = [comentario, titulo];

    try {
        await pool.query(query, values);
        console.log(` > COMENTARIOS > CREAR-----> COMENTARIO CREADO`)
        res.json("Comentario creado con exito");
    } catch (error) {
        console.error('> COMENTARIO > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear el comentario' });
    }
}

// Método para obtener todos los comentarios
async function getComentarios(req, res) {
    const query = 'SELECT * FROM comentarios';

    try {
        const [rows] = await pool.query(query);
        console.log("> COMENTARIOS > OBTENER -----> COMENTARIOS OBTENIDOS")
        res.json({ comentarios: rows });
    } catch (error) {
        console.error('> COMENTARIOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener los comentarios' });
    }
}

// Método para obtener un comentario por su ID
async function getComentarioById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM comentarios WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> COMENTARIOS > OBTENERxID -----> COMENTARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Comentario no encontrada' });
        }
        console.log(`> COMENTARIO > OBTENERxID -----> COMENTARIO OBTENIDO`)
        res.json({ comentario: rows[0] });
    } catch (error) {
        console.error('> COMENTARIO > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener el comentario' });
    }
}

// Método para editar un comentario por su ID
async function editComentario(req, res) {
    const { id } = req.params;
    const { comentario, titulo } = req.body;

    const query = 'UPDATE comentarios SET comentario = ?, titulo = ? WHERE id = ?';
    const values = [comentario, titulo, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> COMENTARIOS > EDITARxID -----> COMENTARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        console.log("> COMENTARIO > EDITAR -----> COMENTARIO EDITADO")
        res.json("Comentario editado con exito");
    } catch (error) {
        console.error('> COMENTARIO > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar el comentario' });
    }
}

// Método para eliminar un comentario por su ID
async function deleteComentario(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM comentarios WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> COMENTARIO > ELIMINAR -----> COMENTARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        console.log("> COMENTARIO > ELIMINAR -----> COMENTARIO ELIMINADO")
        res.json("Comentario eliminado de manera exitosa");
    } catch (error) {
        console.error('"> COMENTARIO > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar el comentario' });
    }
}

module.exports = {
    createComentario,
    getComentarios,
    getComentarioById,
    editComentario,
    deleteComentario
};
