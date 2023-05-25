const pool = require('../../DB');

class Comentarios {
    static async create({ comentario, titulo }) {
        const query = 'INSERT INTO comentarios ( comentario, titulo) VALUES (?, ?)';
        const values = [comentario, titulo];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear el comentario:', error);
            throw error;
        }
    }
}

module.exports = Comentarios;