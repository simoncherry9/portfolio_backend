const pool = require('../../DB');
const nodemailer = require('nodemailer');

// Método para crear un formulario
async function createForm(req, res) {
    const { nombre, email, mensaje } = req.body;

    const query = 'INSERT INTO formularios (nombre, email, mensaje) VALUES (?, ?, ?)';
    const values = [nombre, email, mensaje];

    try {
        await pool.query(query, values);
        console.log(` > FORMULARIO > CREAR-----> FORMULARIO CREADO`)
        res.json("Formulario creado con exito");

        const transporter = nodemailer.createTransport({
            // Configura aquí los detalles del servidor de correo saliente (SMTP)
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
            to: 'simoncherry297@gmail.com',
            subject: 'Nuevo formulario recibido',
            html:
                `
                    <h1>¡Hola Simón!</h1>
                    <p>Acaban de dejarte un nuevo formulario de contacto en tu portfolio</p>
                    <p> El formulario lo dejó <strong>${nombre}</strong> con el siguiente mensaje: <h3><strong>${mensaje}<strong></h3></p>
                    <h3> Si deseas puedes responderle a traves del siguiente correo electrónico: ${email}</h3>
                    <p>Saludos,</p>
                    <p>Envio automático.</p>
                    `,
        };
        const mailOptions2 = {
            from: 'simoncherry9@gmail.com',
            to: email,
            subject: 'Mensaje enviado',
            html:
                `
                    <h1>¡Hola ${nombre}!</h1>
                    <p>Ya le hemos enviado tu formulario de contacto a Simón</p>
                    <p>El te responderá lo más pronto posible, si deseas puedes enviarle un email al siguiente correo: simoncherry297@gmail.com</p>
                    <p>Saludos,</p>
                    <p>Envio automático.</p>
                    `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("> FORMULARIO > CREAR -----> ERROR AL ENVIAR CORREO ELECTRÓNICO", error);
            } else {
                console.log("> FORMULARIO > CREAR -----> CORREO ELECTRÓNICO ENVIADO", info);
            }
        });

        transporter.sendMail(mailOptions2, (error, info) => {
            if (error) {
                console.error("> FORMULARIO > CREAR -----> ERROR AL ENVIAR CORREO ELECTRÓNICO", error);
            } else {
                console.log("> FORMULARIO > CREAR -----> CORREO ELECTRÓNICO ENVIADO", info);
            }
        });

    } catch (error) {
        console.error('> FORMULARIO > CREAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al crear el formulario' });
    }
}

// Método para obtener todos los formularios
async function getFormularios(req, res) {
    const query = 'SELECT * FROM formularios';

    try {
        const [rows] = await pool.query(query);
        console.log("> FORMULARIOS > OBTENER -----> FORMULARIOS OBTENIDOS")
        res.json({ formularios: rows });
    } catch (error) {
        console.error('> FORMULARIOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener los formularios' });
    }
}

// Método para obtener un formulario por su ID
async function getFormsById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM formularios WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> FORMULARIOS > OBTENERxID -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log(`> FORMULARIOS > OBTENERxID -----> FORMULARIO OBTENIDO`)
        res.json({ formulario: rows[0] });
    } catch (error) {
        console.error('> FORMULARIOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener el formulario' });
    }
}

// Método para editar un formulario por su ID
async function editForm(req, res) {
    const { id } = req.params;
    const { nombre, email, mensaje } = req.body;

    const query = 'UPDATE formularios SET nombre = ?, email = ?, mensaje = ? WHERE id = ?';
    const values = [nombre, email, mensaje, id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> FORMULARIOS > EDITARxID -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log("> FORMULARIOS > EDITAR -----> FORMULARIO EDITADO")
        res.json("Formulario editado con exito");
    } catch (error) {
        console.error('> FORMULARIO > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar el formulario' });
    }
}

// Método para eliminar un formulario por su ID
async function deleteForm(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM formularios WHERE id = ?';
    const values = [id];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> FORMULARIOS > ELIMINAR -----> FORMULARIO NO ENCONTRADO -----> ERROR -----> ", error)
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        console.log("> FORMULARIOS > ELIMINAR -----> FORMULARIO ELIMINADO")
        res.json("Formulario eliminado de manera exitosa");
    } catch (error) {
        console.error('"> FORMULARIOS > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar el formulario' });
    }
}

module.exports = {
    createForm,
    getFormularios,
    getFormsById,
    editForm,
    deleteForm
};
