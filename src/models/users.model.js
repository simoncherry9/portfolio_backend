const pool = require('../../DB');

class User {
    static async create({ email, username, password, role }) {
        const query = 'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)';
        const values = [email, username, password, role];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear el nuevo usuario:', error);
            throw error;
        }
    }
}

module.exports = User;
