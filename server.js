const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB Atlas (reemplaza usuario, contraseña y base)
mongoose.connect('mongodb+srv://zoevalo45_36542:Dbu8NwSSU92EE2^qq@zoevalo-backend-clust.mongodb.net/zoevalodb?retryWrites=true&w=majority', 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB', err));

app.use(cors());
app.use(bodyParser.json());

// Definición del esquema y modelo de comentario
const comentarioSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  ip: String,
  fecha: { type: Date, default: Date.now }
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

// Endpoint para obtener los comentarios desde MongoDB
app.get('/api/comentarios', async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fecha: -1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error cargando comentarios' });
  }
});

// Endpoint para guardar un comentario en MongoDB
app.post('/api/comentarios', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje || mensaje.trim() === '') {
    return res.status(400).json({ error: 'Comentario vacío' });
  }

  try {
    const nuevoComentario = new Comentario({ mensaje, ip: req.ip });
    await nuevoComentario.save();
    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando comentario' });
  }
});

// Endpoint para validar captcha (simulado)
app.post('/api/validar-captcha', (req, res) => {
  const { respuesta } = req.body;
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
