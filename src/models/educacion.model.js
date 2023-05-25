const pool = require('../../DB');

class Educacion {
    static async create({ establecimiento, nivel, fechaFin }) {
        const query = 'INSERT INTO educacion ( establecimiento, nivel, fechaFin) VALUES (?, ?, ?)';
        const values = [establecimiento, nivel, fechaFin];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear la educacion:', error);
            throw error;
        }
    }
}

module.exports = Educacion;