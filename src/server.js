// server.js
const express = require('express');
const path = require('path');
const authRoutes = require('../routes/auth.routes');


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Servir archivos estáticos desde el directorio Frontend/public
app.use(
    express.static(
        path.join(__dirname, '../../Frontend/public')
    )
)


//auth donde esta el diccionario de js y tal...
app.use('/api/auth', authRoutes);

// Archivos estáticos (todo el frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta principal (inicio)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../..Frontend/public/index.html'));
});

// Servidor activo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
