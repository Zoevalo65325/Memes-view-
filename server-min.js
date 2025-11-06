const express = require('express');
const app = express();

// Puerto asignado por entorno o 3000 local
const PORT = process.env.PORT || 3000;

// Ruta raíz simple que responde con texto plano
app.get('/', (req, res) => {
  res.send('Servidor mínimo funcionando correctamente');
});

// Inicia el servidor en puerto y dirección accesible para Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor mínimo escuchando en puerto ${PORT}`);
});
