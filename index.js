const express = require('express');
const cors = require('cors');

const usersRoutes = require('./src/routes/users.routes');
const experienciaRoutes = require('./src/routes/experiencias.routes');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Routes

app.use('/api', usersRoutes);
app.use('/api', experienciaRoutes);

// Start the server
app.listen(port, () => {
    console.log(`> APLICACIÓN CORRIENDO EN EL PUERTO -----> ${port}`);
});
