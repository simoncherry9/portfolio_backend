const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'b5yd2a6kpynvzphpoqia-mysql.services.clever-cloud.com',
    user: 'uecl2ytuf20q8gge',
    password: 'V5ywBVLlGcEE55YAvXlV',
    database: 'b5yd2a6kpynvzphpoqia',
    connectionLimit: 10,
    waitForConnections: true,
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

