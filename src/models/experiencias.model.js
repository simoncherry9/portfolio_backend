const pool = require('../../DB');

class Experiencia {
    static async create({ compañia, puesto, descripcion, fechaFin }) {
        const query = 'INSERT INTO experiencias ( compañia, puesto, descripcion, fechaFin) VALUES (?, ?, ?, ?)';
        const values = [compañia, puesto, descripcion, fechaFin];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear la experiencia laboral:', error);
            throw error;
        }
    }
}

module.exports = Experiencia;
