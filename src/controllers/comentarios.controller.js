const pool = require('../../DB');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const claveSecreta = process.env.SECRET_KEY;

// Método para crear un comentario
async function createComentario(req, res) {
    const { comentario, titulo } = req.body;

    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization;

    try {
        // Verificar si el token existe y tiene el formato correcto
        if (!token || !token.startsWith('Bearer ')) {
            console.log('> ERROR -----> NO SE DETECTÓ TOKEN');
            return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
        }

        // Separar el token en esquema y token real
        const [scheme, tokenWithoutScheme] = token.split(' ');

        // Verificar si el esquema es "Bearer"
        if (scheme !== 'Bearer') {
            console.log('> ERROR -----> ESQUEMA DE TOKEN INVÁLIDO');
            return res.status(401).json({ error: 'Esquema de token inválido' });
        }

        // Decodificar el token y extraer el username
        const decodedToken = jwt.verify(tokenWithoutScheme, claveSecreta); // Utiliza la clave secreta desde el entorno
        const username = decodedToken.username;

        const query = 'INSERT INTO comentarios (comentario, titulo, username) VALUES (?, ?, ?)';
        const values = [comentario, titulo, username];

        await pool.query(query, values);
        console.log('> COMENTARIOS > CREAR -----> COMENTARIO CREADO');
        res.json('Comentario creado con éxito');
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.log('> COMENTARIO > CREAR -----> ERROR -----> Token inválido', decodedToken);
            return res.status(401).json({ error: 'Token inválido' });
        }
        console.error('> COMENTARIO > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear el comentario' });
    }
}

// Método para obtener todos los comentarios
async function getComentarios(req, res) {
    const query = 'SELECT * FROM comentarios';

    try {
        const [rows] = await pool.query(query);
        console.log("> COMENTARIOS > OBTENER -----> COMENTARIOS OBTENIDOS");
        const comentarios = rows.map(row => ({
            id: row.id,
            titulo: row.titulo,
            comentario: row.comentario,
            username: row.username
        }));
        res.json(comentarios);
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

    const querySelect = 'SELECT username FROM comentarios WHERE id = ?';
    const queryUpdate = 'UPDATE comentarios SET comentario = ?, titulo = ? WHERE id = ?';
    const valuesSelect = [id];
    const valuesUpdate = [comentario, titulo, id];

    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization;

    try {
        // Verificar si el token existe y tiene el formato correcto
        if (!token || !token.startsWith('Bearer ')) {
            console.log('> ERROR -----> NO SE DETECTÓ TOKEN');
            return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
        }

        // Separar el token en esquema y token real
        const [scheme, tokenWithoutScheme] = token.split(' ');

        // Verificar si el esquema es "Bearer"
        if (scheme !== 'Bearer') {
            console.log('> ERROR -----> ESQUEMA DE TOKEN INVÁLIDO');
            return res.status(401).json({ error: 'Esquema de token inválido' });
        }

        // Decodificar el token y extraer el username
        const decodedToken = jwt.verify(tokenWithoutScheme, claveSecreta); // Utiliza la clave secreta desde el entorno
        const username = decodedToken.username;

        // Obtener el username del comentario que se va a editar
        const [rows] = await pool.query(querySelect, valuesSelect);
        const commentUsername = rows[0].username;

        // Verificar si el usuario que realiza la edición es el mismo que creó el comentario
        if (username !== commentUsername) {
            console.log('> COMENTARIO > EDITAR -----> ERROR -----> Usuario no autorizado');
            return res.status(403).json({ error: 'No estás autorizado para editar este comentario' });
        }

        // Actualizar el comentario en la base de datos
        const [result] = await pool.query(queryUpdate, valuesUpdate);

        if (result.affectedRows === 0) {
            console.log("> COMENTARIOS > EDITARxID -----> COMENTARIO NO ENCONTRADO -----> ERROR");
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        console.log("> COMENTARIO > EDITAR -----> COMENTARIO EDITADO");
        res.json("Comentario editado con éxito");
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.log('> COMENTARIO > EDITAR -----> ERROR -----> Token inválido', token);
            return res.status(401).json({ error: 'Token inválido' });
        }
        console.error('> COMENTARIO > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar el comentario' });
    }
}

// Método para eliminar un comentario por su ID
async function deleteComentario(req, res) {
    const { id } = req.params;

    const querySelect = 'SELECT username FROM comentarios WHERE id = ?';
    const queryDelete = 'DELETE FROM comentarios WHERE id = ?';
    const valuesSelect = [id];
    const valuesDelete = [id];

    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization;

    try {
        // Verificar si el token existe y tiene el formato correcto
        if (!token || !token.startsWith('Bearer ')) {
            console.log('> ERROR -----> NO SE DETECTÓ TOKEN');
            return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
        }

        // Separar el token en esquema y token real
        const [scheme, tokenWithoutScheme] = token.split(' ');

        // Verificar si el esquema es "Bearer"
        if (scheme !== 'Bearer') {
            console.log('> ERROR -----> ESQUEMA DE TOKEN INVÁLIDO');
            return res.status(401).json({ error: 'Esquema de token inválido' });
        }

        // Decodificar el token y extraer el username
        const decodedToken = jwt.verify(tokenWithoutScheme, claveSecreta); // Utiliza la clave secreta desde el entorno
        const username = decodedToken.username;

        // Obtener el username del comentario que se va a eliminar
        const [rows] = await pool.query(querySelect, valuesSelect);
        const commentUsername = rows[0].username;

        // Verificar si el usuario que realiza la eliminación es el mismo que creó el comentario
        if (username !== commentUsername) {
            console.log('> COMENTARIO > ELIMINAR -----> ERROR -----> Usuario no autorizado');
            return res.status(403).json({ error: 'No estás autorizado para eliminar este comentario' });
        }

        // Eliminar el comentario de la base de datos
        const [result] = await pool.query(queryDelete, valuesDelete);

        if (result.affectedRows === 0) {
            console.log("> COMENTARIO > ELIMINAR -----> COMENTARIO NO ENCONTRADO -----> ERROR");
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        console.log("> COMENTARIO > ELIMINAR -----> COMENTARIO ELIMINADO");
        res.json("Comentario eliminado de manera exitosa");
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.log('> COMENTARIO > ELIMINAR -----> ERROR -----> Token inválido', token);
            return res.status(401).json({ error: 'Token inválido' });
        }
        console.error('> COMENTARIO > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar el comentario' });
    }

}
async function getComentariosByUsername(req, res) {
    const { username } = req.params;

    const query = 'SELECT * FROM comentarios WHERE username = ?';
    const values = [username];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log('> COMENTARIOS > OBTENERxUSERNAME -----> COMENTARIOS NO ENCONTRADOS');
            return res.status(404).json({ error: 'No se encontraron comentarios para el usuario especificado' });
        }

        console.log('> COMENTARIOS > OBTENERxUSERNAME -----> COMENTARIOS OBTENIDOS');
        const comentarios = rows.map(row => ({
            id: row.id,
            titulo: row.titulo,
            comentario: row.comentario,
            username: row.username
        }));
        res.json(comentarios);
    } catch (error) {
        console.error('> COMENTARIOS > OBTENERxUSERNAME -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener los comentarios' });
    }
}

module.exports = {
    createComentario,
    getComentarios,
    getComentarioById,
    editComentario,
    deleteComentario,
    getComentariosByUsername,
};
