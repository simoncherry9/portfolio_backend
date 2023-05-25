const express = require('express');
const cors = require('cors');

const usersRoutes = require('./src/routes/users.routes');
const experienciaRoutes = require('./src/routes/experiencias.routes');
const aptitudesRoutes = require('./src/routes/aptitudes.routes');
const educacionRoutes = require('./src/routes/educacion.routes');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Routes

app.use('/api', usersRoutes);
app.use('/api', experienciaRoutes);
app.use('/api', aptitudesRoutes);
app.use('/api', educacionRoutes);

// Start the server
app.listen(port, () => {
    console.log(`*****( APLICACIÓN FUNCIONANDO EN EL PUERTO ${port} )*****`);
});
