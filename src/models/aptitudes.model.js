const pool = require('../../DB');

class Aptitudes {
    static async create({ nombre, descripcion, porcentaje }) {
        const query = 'INSERT INTO aptitudes ( compañia, puesto, descripcion) VALUES (?, ?, ?)';
        const values = [nombre, descripcion, porcentaje];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear la aptitud:', error);
            throw error;
        }
    }
}

module.exports = Aptitudes;