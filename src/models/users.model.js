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

    static async updatePassword(email, newPassword) {
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        const values = [newPassword, email];

        try {
            await pool.query(query, values);
        } catch (error) {
            console.error('Error al actualizar la contraseña del usuario:', error);
            throw error;
        }
    }

    static async findOneByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const values = [email];

        try {
            const [rows] = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por email:', error);
            throw error;
        }
    }

    static async findOne(query, values) {
        const sql = 'SELECT * FROM users WHERE ' + query;
        try {
            const [rows] = await pool.query(sql, values);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            throw error;
        }
    }

    static async findAll() {
        const query = 'SELECT * FROM users';

        try {
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const values = [id];

        try {
            const [rows] = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por ID:', error);
            throw error;
        }
    }

    static async findOneByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        const values = [username];

        try {
            const [rows] = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar el usuario por username:', error);
            throw error;
        }
    }

    static async findOneAndUpdate(query, update) {
        try {
            const result = await pool.query('UPDATE users SET ? WHERE ?', [update, query]);
            return result;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    }


}

module.exports = User;
