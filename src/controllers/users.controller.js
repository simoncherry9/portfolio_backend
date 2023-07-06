const User = require('../../src/models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const pool = require('../../DB');

const claveSecreta = process.env.SECRET_KEY;

class UsersController {
    static async createUser(req, res) {
        const { email, username, password, role } = req.body;
        const userRole = role || 'visitante';

        try {
            const existingUser = await User.findOne(
                `email = '${email}' OR username = '${username}'`
            );
            if (existingUser) {
                return res
                    .status(409)
                    .json({ error: 'El email o el username ya están en uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const userId = await User.create({
                email,
                username,
                password: hashedPassword,
                role: userRole,
            });

            const token = jwt.sign(
                { role: User.role, username: User.username },
                claveSecreta,
                { algorithm: 'HS256' }
            );

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
                from: 'simoncherry9@gmail.com',
                to: email,
                subject: 'Bienvenido a nuestra página web',
                html: `
          <h1>¡Hola ${username}!</h1>
          <p>Bienvenido a nuestra web. Este e-mail es para agradecerte tu apoyo al registrarte en mi portfolio.</p>
          <p>Esperamos que disfrutes de la experiencia.</p>
          <p>Podrás iniciar sesión a través del siguiente link</p>
          <ul>
            <li><a href="https://ejemplo.com">Iniciar Sesión</a></li>
          </ul>
          <h3>Los datos de tu cuenta son:</h3>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${password}</p>
          <p>Saludos,</p>
          <p>Simón Cherry</p>
        `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('> USUARIO > CREAR > ENVIAR EMAIL -----> ERROR', error);
                } else {
                    console.log(
                        '> USUARIO > CREAR > ENVIAR EMAIL -----> EMAIL ENVIADO A ID:',
                        userId,
                        info
                    );
                }
            });

            console.log('> USUARIO > CREAR -----> USUARIO CREADO');
            res.json({ message: 'USUARIO CREADO', userId, token });
        } catch (error) {
            console.error('> USUARIO > CREAR -----> ERROR', error);
            res
                .status(500)
                .json({ error: 'ERROR INTERNO AL INTENTAR CREAR EL USUARIO' });
        }
    }

    static async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOneByEmail(email);

            if (!user) {
                console.log('> USUARIO > LOGIN -----> ERROR -----> USUARIO NO ENCONTRADO');
                return res.status(401).json({ error: 'El usuario no existe' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log('> USUARIO > LOGIN -----> ERROR -----> CONTRASEÑA INCORRECTA');
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { role: user.role, username: user.username },
                claveSecreta,
                { algorithm: 'HS256', expiresIn: '1h' }
            );

            res.json({ token });
            console.log(`> USUARIO > LOGIN -----> CORRECTO -----> USUARIO: ${email}`);
        } catch (error) {
            console.error('> USUARIO > LOGIN -----> ERROR', error);
            res
                .status(500)
                .json({ error: 'ERROR INTERNO AL INTENTAR INICIAR SESIÓN' });
        }
    }

    static async getUser(req, res) {
        const { username } = req.params;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            console.error('> USUARIO > OBTENER -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL OBTENER EL USUARIO' });
        }
    }

    static async getUserById(req, res) {
        const { id } = req.params;

        const query = 'SELECT * FROM users WHERE id = ?';
        const values = [id];

        try {
            const [rows] = await pool.query(query, values);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ user: rows[0] });
        } catch (error) {
            console.error('> USUARIO > OBTENER POR ID -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL OBTENER EL USUARIO' });
        }
    }

    static async deleteUser(req, res) {
        const { userId } = req.params;

        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('> USUARIO > ELIMINAR -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL ELIMINAR EL USUARIO' });
        }
    }

    // Dentro de UsersController
    static async editUser(req, res) {
        const { username } = req.params;
        const { email, password } = req.body;

        try {
            // Verificar si el usuario logueado coincide con el nombre de usuario proporcionado
            if (req.user.username !== username) {
                return res.status(401).json({ error: 'No tienes permiso para editar este usuario' });
            }

            // Verificar si el usuario logueado es un administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }

            // Buscar y actualizar el perfil del usuario
            const user = await User.findOneAndUpdate({ username }, { email, password }, { new: true });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({ message: 'Perfil de usuario actualizado correctamente', user });
        } catch (error) {
            console.error('> USUARIO > EDITAR -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL EDITAR EL USUARIO' });
        }
    }



    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('> USUARIO > OBTENER TODOS -----> ERROR', error);
            res.status(500).json({ error: 'ERROR INTERNO AL INTENTAR OBTENER TODOS LOS USUARIOS' });
        }
    }



}

module.exports = UsersController;
