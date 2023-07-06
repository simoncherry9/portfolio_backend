const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../src/models/users.model');

const claveSecreta = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> ERROR -----> NO SE DETECTÓ TOKEN ----->");
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, claveSecreta, { algorithms: ['HS256'] }, async (err, decoded) => {
        if (err) {
            console.log("> ERROR -----> TOKEN DE AUTENTICACIÓN INVÁLIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' });
        }

        const user = await User.findOneByEmail(decoded.email);

        if (!user || user.username !== decoded.username) {
            console.log("> ERROR -----> USUARIO NO ENCONTRADO O NO COINCIDE ----->");
            return res.status(401).json({ error: 'Usuario no encontrado o no coincide' });
        }

        req.user = decoded;
        next();
    });
}

function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> ERROR -----> NO SE DETECTÓ TOKEN ----->");
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, claveSecreta, { algorithms: ['HS256'] }, async (err, decoded) => {
        if (err) {
            console.log("> ERROR -----> TOKEN DE AUTENTICACIÓN INVÁLIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' });
        }

        const user = await User.findOneByEmail(decoded.email);

        if (!user || user.username !== decoded.username) {
            console.log("> ERROR -----> USUARIO NO ENCONTRADO O NO COINCIDE ----->");
            return res.status(401).json({ error: 'Usuario no encontrado o no coincide' });
        }

        if (user.role !== 'admin') {
            console.log("> ERROR -----> ACCESO NO AUTORIZADO ----->");
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        req.user = decoded;
        next();
    });
}

function loginUser(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        console.log("> ERROR -----> NO SE DETECTÓ TOKEN ----->");
        return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
    }

    const tokenWithoutScheme = token.split(' ')[1];

    jwt.verify(tokenWithoutScheme, claveSecreta, { algorithms: ['HS256'] }, async (err, decoded) => {
        if (err) {
            console.log("> ERROR -----> TOKEN DE AUTENTICACIÓN INVÁLIDO ----->", err);
            return res.status(401).json({ error: 'Token de autenticación inválido' });
        }

        const user = await User.findOneByEmail(decoded.email);

        if (!user || user.username !== decoded.username) {
            console.log("> ERROR -----> USUARIO NOENCONTRADO O NO COINCIDE ----->", decoded.username);
            return res.status(401).json({ error: 'Usuario no encontrado o no coincide' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = { verifyToken, verifyAdminToken, loginUser };
