require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 10000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ ERROR: Variable de entorno MONGO_URI no está configurada');
  console.error('En Render: Ve a Environment y configura MONGO_URI con tu cadena de conexión');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ===== ESQUEMA COMENTARIOS =====
const comentarioSchema = new mongoose.Schema({
  mensaje: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  ip: String,
  fecha: { type: Date, default: Date.now }
}, {
  collection: 'comentarios'
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

// ===== ENDPOINT CAPTCHA =====
app.post('/api/validar-captcha', (req, res) => {
  const { respuesta } = req.body;

  // La respuesta correcta es '4' (2 + 2 = 4)
  if (respuesta === '4' || respuesta === 4) {
    console.log('✅ Captcha validado correctamente');
    res.json({ ok: true });
  } else {
    console.log('❌ Captcha inválido, respuesta recibida:', respuesta);
    res.json({ ok: false });
  }
});

// ===== ENDPOINT COMENTARIOS - GET =====
app.get('/api/comentarios', async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fecha: -1 }).limit(100);
    res.json(comentarios);
  } catch (error) {
    console.error('Error cargando comentarios:', error);
    res.status(500).json({ error: 'Error cargando comentarios' });
  }
});

// ===== ENDPOINT COMENTARIOS - POST =====
app.post('/api/comentarios', async (req, res) => {
  try {
    const { mensaje } = req.body;
    
    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).json({ error: 'Comentario vacío' });
    }
    
    if (mensaje.length > 500) {
      return res.status(400).json({ error: 'Comentario muy largo' });
    }

    const nuevoComentario = new Comentario({
      mensaje: mensaje.trim(),
      ip: req.ip || req.connection.remoteAddress || 'desconocida'
    });

    await nuevoComentario.save();
    console.log('✅ Comentario guardado exitosamente:', nuevoComentario._id);
    res.status(201).json({ ok: true, id: nuevoComentario._id });
  } catch (error) {
    console.error('Error al guardar comentario:', error);
    res.status(500).json({ error: 'Error guardando comentario' });
  }
});

// ===== RUTAS ADICIONALES =====
app.get('/', (req, res) => {
  res.send('Backend de Zoevalo funcionando');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    puerto: PORT, 
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    baseDatos: mongoose.connection.name || 'sin conexión'
  });
});

// ===== CONEXIÓN MONGODB Y LEVANTAMIENTO DEL SERVIDOR =====
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
  .then((conn) => {
    console.log('✅ Conectado a MongoDB Atlas');
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📁 Base de Datos: ${conn.connection.name}`);
    console.log(`🗂️ Colección: comentarios`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión MongoDB:', err.message);
    console.error('Verifica:');
    console.error('1. Variable MONGO_URI en Render');
    console.error('2. Whitelist IP en MongoDB Atlas (0.0.0.0/0)');
    console.error('3. Usuario y contraseña correctos');
    process.exit(1);
  });

// ===== EVENTOS DE CONEXIÓN =====
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en conexión MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado de MongoDB');
});

// ===== MANEJO DE ERRORES NO CAPTURADOS =====
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Rechazo no manejado:', reason);
});
