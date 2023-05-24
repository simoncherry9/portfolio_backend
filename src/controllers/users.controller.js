const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UsersController {
    static async createUser(req, res) {
        const { email, username, password, role } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const userId = await User.create({
                email,
                username,
                password: hashedPassword,
                role,
            });

            const token = jwt.sign({ role }, process.env.SECRET_KEY);

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
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Bienvenido a nuestra página web',
                text: `¡Hola ${username}!\n\nBienvenido a nuestra web. Esperamos que disfrutes de la experiencia.\n\nSaludos. \n\nSimón Cherry`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('> USUARIO > CREAR > ENVIAR EMAIL -----> ERROR', error);
                } else {
                    console.log('> USUARIO > CREAR > ENVIAR EMAIL -----> EMAIL ENVIADO A ID:', userId);
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

            const token = jwt.sign({ role: user.role }, process.env.SECRET_KEY);

            res.json({ token });
            console.log(`> USUARIO > LOGIN -----> CORRECTO -----> USUARIO: ${email}`)
        } catch (error) {
            console.error('> USUARIO > LOGIN -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL INTENTAR INICIAR SESIÓN' });
        }
    }
}

module.exports = UsersController;
