const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

class UsersController {
    static async createUser(req, res) {
        const { email, username, password, role } = req.body;
        const userRole = role || 'visitante';

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const userId = await User.create({
                email,
                username,
                password: hashedPassword,
                role: userRole,
            });

            const token = jwt.sign({ role: User.role }, process.env.SECRET_KEY, { algorithm: 'HS256' });

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'simoncherry9@gmail.com',
                    pass: 'qielbknpzzdbunxr',
                },
            });

            const mailOptions = {
                from: "simoncherry9@gmail.com",
                to: email,
                subject: 'Bienvenido a nuestra página web',
                html:
                    `
                    <h1>¡Hola ${username}!</h1>
                    <p>Bienvenido a nuestra web. Este e-mail es para agradecerte tu apoyo al registrarte en mi portfolio.</p>
                    <p>Esperamos que disfrutes de la experiencia.</p>
                    <p>Podrás iniciar sesión a traves del siguiente link</p>
                    <ul>
                    <li><a href="https://ejemplo.com">Iniciar Sesión</a></li>
                    </ul>
                    <h3> Los datos de tu cuenta son:</h3>
                    <p> <b> Email: </b> ${email} </p>
                    <p> <b> Password: </b> ${password} </p>
                    <p>Saludos,</p>
                    <p>Simón Cherry</p>
                    `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('> USUARIO > CREAR > ENVIAR EMAIL -----> ERROR', error);
                } else {
                    console.log('> USUARIO > CREAR > ENVIAR EMAIL -----> EMAIL ENVIADO A ID:', userId, info);
                }
            });

            console.log("> USUARIO > CREAR -----> USUARIO CREADO")
            res.json({ message: 'USUARIO CREADO', userId, token });
        } catch (error) {
            console.error('> USUARIO > CREAR -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL INTENTAR CREAR EL USUARIO' });
        }
    }

    static async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOneByEmail(email);

            if (!user) {
                console.log("> USUARIO > LOGIN -----> ERROR -----> USUARIO NO ENCONTRADO")
                return res.status(401).json({ error: 'El usuario no existe' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log("> USUARIO > LOGIN -----> ERROR -----> CONTRASEÑA INCORRECTA")
                return res.status(401).json({ error: 'Contrasñea incorrecta' });
            }

            const token = jwt.sign({ role: user.role }, process.env.SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });

            res.json({ token });
            console.log(`> USUARIO > LOGIN -----> CORRECTO -----> USUARIO: ${email}`)
        } catch (error) {
            console.error('> USUARIO > LOGIN -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL INTENTAR INICIAR SESIÓN' });
        }
    }
}

module.exports = UsersController;
