const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors
const app = express();
const PORT = 3000;

// Habilita CORS para permitir peticiones del frontend
app.use(cors());

app.use(bodyParser.json());

// Variables para almacenar comentarios y controlar IPs que ya comentaron
let comentarios = [];
let commentedIPs = new Set();

// Ruta para recibir comentarios
app.post('/api/comentarios', (req, res) => {
  const ip = req.ip;

  if (commentedIPs.has(ip)) {
    return res.status(429).json({ error: 'Ya has enviado un comentario' });
  }

  const { mensaje } = req.body;
  if (!mensaje || mensaje.trim().length === 0) {
    return res.status(400).json({ error: 'Comentario vacío' });
  }

  comentarios.push({ mensaje, ip });
  commentedIPs.add(ip);

  res.json({ ok: true });
});

// Ruta para obtener todos los comentarios
app.get('/api/comentarios', (req, res) => {
  res.json(comentarios);
});

// Ruta para validar captcha (ejemplo)
app.post('/api/validar-captcha', (req, res) => {
  const { respuesta } = req.body;
  if (respuesta === "4") {
    res.json({ ok: true });
  } else {
    res.status(400).json({ ok: false, error: "Captcha incorrecto" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
