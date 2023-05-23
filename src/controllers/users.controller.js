const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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

            // Enviar correo de bienvenida
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
}

module.exports = UsersController;
