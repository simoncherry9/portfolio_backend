const pool = require('../../DB');

class Formularios {
    static async create({ nombre, email, mensaje }) {
        const query = 'INSERT INTO formularios ( nombre, email, mensaje) VALUES (?, ?, ?)';
        const values = [nombre, email, mensaje];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear el formulario:', error);
            throw error;
        }
    }
}

module.exports = Formularios;