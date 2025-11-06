const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Datos simulados para comentarios
let comentarios = [];

// Endpoint para obtener los comentarios
app.get('/api/comentarios', (req, res) => {
  res.json(comentarios);
});

// Endpoint para guardar un comentario
app.post('/api/comentarios', (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje || mensaje.trim() === '') {
    return res.status(400).json({ error: 'Comentario vacío' });
  }
  // Aquí se podría agregar lógica para evitar spam, validar contenido, etc.
  comentarios.push({ mensaje, ip: req.ip });
  res.status(201).json({ ok: true });
});

// Endpoint para validar captcha (simulado)
app.post('/api/validar-captcha', (req, res) => {
  const { respuesta } = req.body;
  // Simula la validación: respuesta correcta es "4"
  if (respuesta === "4" || respuesta === 4) {
    return res.json({ ok: true });
  } else {
    return res.json({ ok: false });
  }
});

// Ruta raíz para sanity check
app.get('/', (req, res) => {
  res.send('Backend de Zoevalo prueba funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
