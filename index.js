const express = require('express');
const cors = require('cors');

const usersRoutes = require('./src/routes/users.routes');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Routes

app.use('/api', usersRoutes);

// Start the server
app.listen(port, () => {
    console.log(`> APLICACIÓN CORRIENDO EN EL PUERTO -----> ${port}`);
});
