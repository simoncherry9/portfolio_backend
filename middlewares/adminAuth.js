const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const claveSecreta = process.env.SECRET_KEY;

function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> ERROR -----> NO SE DETECTO TOKEN ----->", error);
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' + error });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, claveSecreta, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            console.log("> ERROR -----> TOKEN DE AUTENTICACION IVALIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' + err });
        }

        if (decoded.role !== 'admin') {
            console.log("> ERROR -----> ACCESO NO AUTORIZADO ----->", err);
            return res.status(403).json({ error: 'Acceso no autorizado' + err });
        }

        req.user = decoded;
        next();
    });
}

function loginUser(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> ERROR -----> NO SE DETECTO TOKEN ----->", error);
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' + error });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, claveSecreta, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            console.log("> ERROR -----> TOKEN DE AUTENTICACION IVALIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' + err });
        }

        req.user = decoded;
        next();
    });
}

module.exports = { verifyAdminToken, loginUser };
