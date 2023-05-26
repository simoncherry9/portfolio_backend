const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../DB');

// Configurar Firebase
const serviceAccount = require('../../middlewares/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "portfolio-final-c2fd4.appspot.com" // Reemplaza con tu storageBucket correcto
});
const bucket = admin.storage().bucket();

// Configurar Multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('imagen');

// Método para subir la imagen a Firebase Storage
async function uploadImageToFirebase(file) {
    try {
        if (!file) {
            throw new Error('No se ha proporcionado ningún archivo.');
        }

        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname);
        const fileName = uniqueSuffix + extension;
        const filePath = `proyectos/${fileName}`;
        const fileUpload = bucket.file(filePath);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        await new Promise((resolve, reject) => {
            blobStream.on('error', (error) => {
                reject(new Error('Error al subir la imagen.'));
            });

            blobStream.on('finish', () => {
                resolve();
            });

            blobStream.end(file.buffer);
        });

        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        return imageUrl;
    } catch (error) {
        throw new Error('Error al subir la imagen.');
    }
}

// Método para crear un proyecto
async function createProyecto(req, res) {
    upload(req, res, async function (error) {
        if (error) {
            console.error('> PROYECTOS > CREAR -----> ERROR -----> ', error);
            return res.status(500).json({ error: 'Error interno al cargar la imagen' });
        }

        const { nombre, descripcion, funciones, tecnologias, linkRepo } = req.body;

        try {
            const imageUrl = await uploadImageToFirebase(req.file);

            const query = 'INSERT INTO proyectos (nombre, descripcion, funciones, tecnologias, linkRepo, urlImg) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [nombre, descripcion, funciones, tecnologias, linkRepo, imageUrl];

            await pool.query(query, values);

            console.log('> PROYECTOS > CREAR -----> PROYECTO CREADO');
            res.json('Proyecto creado con éxito');
        } catch (error) {
            console.error('> PROYECTOS > CREAR -----> ERROR -----> ', error);
            res.status(500).json({ error: 'Error interno al crear el proyecto' });
        }
    });
}

// Método para obtener todas los proyectos
async function getProyectos(req, res) {
    const query = 'SELECT * FROM proyectos';

    try {
        const [rows] = await pool.query(query);
        const proyectos = rows.map((proyecto) => {
            return {
                ...proyecto,
                urlImg: `https://storage.googleapis.com/${bucket.name}/${proyecto.urlImg}`
            };
        });
        console.log("> PROYECTOS > OBTENER -----> PROYECTOS OBTENIDOS")
        res.json({ proyectos: rows });
    } catch (error) {
        console.error('> PROYECTOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener los proyectos' });
    }
}

// Método para obtener un proyecto por su ID
async function getProyectosById(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM proyectos WHERE id = ?';
    const values = [id];

    try {
        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("> PROYECTOS > OBTENERxID -----> PROYECTO NO ENCONTRADO -----> ERROR -----> ")
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        console.log(`> PROYECTOS > OBTENERxID -----> Proyecto obtenido`)
        res.json({ proyecto: rows[0] });
    } catch (error) {
        console.error('> PROYECTOS > OBTENER -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al obtener el proyecto' });
    }
}

// Función para eliminar la imagen de Firebase Storage
function deleteImageFromFirebase(imageUrl) {
    return new Promise((resolve, reject) => {
        if (!imageUrl) {
            reject(new Error('No se ha proporcionado ninguna URL de imagen.'));
        }

        const fileName = getImageFileNameFromUrl(imageUrl);
        const file = bucket.file(fileName);

        file.delete((error) => {
            if (error) {
                reject(new Error('Error al eliminar la imagen.'));
            } else {
                resolve();
            }
        });
    });
}


function getImageFileNameFromUrl(imageUrl) {
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1];
    const folderName = 'proyectos'; // Carpeta donde se encuentran las imágenes
    return `${folderName}/${fileName}`;
}

// Método para editar un proyecto por su ID
async function editProyecto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, funciones, tecnologias, linkRepo, urlImg } = req.body;

    const query = 'UPDATE proyectos SET nombre = ?, descripcion = ?, funciones = ?, tecnologias = ?, linkRepo = ?, urlImg = ? WHERE id = ?';
    const values = [nombre, descripcion, funciones, tecnologias, linkRepo, urlImg, id];

    try {
        // Obtener la URL de la imagen antes de realizar la actualización
        const [rows] = await pool.query('SELECT urlImg FROM proyectos WHERE id = ?', [id]);
        const prevImageUrl = rows[0].urlImg;

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> PROYECTOS > EDITARxID -----> PROYECTO NO ENCONTRADO -----> ERROR -----> ", error);
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        // Si la URL de la imagen ha cambiado, eliminar la imagen anterior de Firebase
        if (prevImageUrl !== urlImg) {
            await deleteImageFromFirebase(prevImageUrl);
        }

        console.log("> PROYECTOS > EDITAR -----> PROYECTO EDITADO");
        res.json("Proyecto editado con éxito");
    } catch (error) {
        console.error('> PROYECTOS > EDITAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al editar el proyecto' });
    }
}

// Método para eliminar un proyecto por su ID
async function deleteProyecto(req, res) {
    const { id } = req.params;

    try {
        // Obtener la URL de la imagen antes de eliminar el proyecto
        const [rows] = await pool.query('SELECT urlImg FROM proyectos WHERE id = ?', [id]);
        const imageUrl = rows[0].urlImg;

        console.log('URL de la imagen a eliminar:', imageUrl);

        const query = 'DELETE FROM proyectos WHERE id = ?';
        const values = [id];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            console.log("> PROYECTOS > ELIMINAR -----> PROYECTO NO ENCONTRADO -----> ERROR -----> ", error);
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        // Eliminar la imagen de Firebase
        await deleteImageFromFirebase(imageUrl);

        console.log("> PROYECTOS > ELIMINAR -----> PROYECTO ELIMINADO");
        res.json("Proyecto eliminado de manera exitosa");
    } catch (error) {
        console.error('"> PROYECTOS > ELIMINAR -----> ERROR -----> ', error);
        res.status(500).json({ error: 'Error interno al eliminar el proyecto' });
    }
}

module.exports = {
    createProyecto,
    getProyectos,
    getProyectosById,
    editProyecto,
    deleteProyecto
};
