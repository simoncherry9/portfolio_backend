const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});

(async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('> DATABASE > CONEXION -----> CORRECTO');
    } catch (err) {
        console.error('> DATABASE > CONEXION -----> ERROR ----->', err);
    } finally {
        if (connection) {
            connection.release();
        }
    }
})();

pool.on('error', (err) => {
    console.error('> DATABASE > ERROR DE CONEXION ----->', err);
});

module.exports = pool;

