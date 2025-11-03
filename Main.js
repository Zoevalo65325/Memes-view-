// Seguridad clickjacking
if (self !== top) {
  top.location = self.location;
}

// Datos memes y frases
const MEMES = [
  { titulo:"Chill de cojones 😌", descripcion:"Relajación máxima 💆‍♂️", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/chillde.jpeg", emoji:"😌"},
  { titulo:"Bob Esponja 🤪", descripcion:"¡Burla asegurada! 🍍", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/bob.jpg", emoji:"🤪"},
  { titulo:"Pikachu Sorprendido 😱", descripcion:"¡No me lo esperaba! ⚡", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/pikachu.jpeg", emoji:"⚡"},
  { titulo:"Gato Meme 🐱", descripcion:"¿Miau dices? 😺", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/gato%20meme.jpeg", emoji:"😺"},
  { titulo:"Patrick Malvado 😏", descripcion:"Risa traviesa 🦑", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/patricio.jpg", emoji:"😏"},
  { titulo:"Stonks 💹", descripcion:"Dinero para todos 🤑", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/stonks.jpeg", emoji:"💹"}
];

const FRASES_XD = [
  "Mi cara cuando veo pizza gratis... 🤤🍕",
  "Quise madrugar... mi cama dijo NO. 😴",
  "¿Por qué día lluvioso? ¡Quiero mi sol y mi helado! 🌞🍦",
  "Desayuné y ya tengo hambre otra vez. 🥞😂",
  "¡Hoy sí hago ejercicio! ...Bueno, mejor mañana 😂🏋️‍♂️",
  "Me reí tan fuerte que desperté al perro. 🐶🤣",
  "Aplausos para mí: no perdí las llaves hoy. 🗝👏",
  "¿Quién dejó el modo flojera encendido? 🛋️💤",
  "Hoy no hay tarea, ¿verdad profe? 😶✏️"
];

const RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const MEME_BACKUP = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

let audioAllowed = false;

// CAPTCHA
const preguntasCaptcha = [
  { pregunta: "¿Cuánto es 2 + 2?", respuesta: "4" },
  { pregunta: "¿Cuál es el color del cielo?", respuesta: "azul" },
  { pregunta: "¿Cuántos lados tiene un triángulo?", respuesta: "3" },
  { pregunta: "¿Capital de Francia?", respuesta: "parís" }
];

let captchaActual = null;

function inicializarCaptcha() {
  const randomIndex = Math.floor(Math.random() * preguntasCaptcha.length);
  captchaActual = preguntasCaptcha[randomIndex];
  document.getElementById('captcha-pregunta').textContent = captchaActual.pregunta + " 🤔";
  document.getElementById('captcha-input').value = "";
  document.getElementById('captcha-error').textContent = "";
}

function verificarCaptcha() {
  let respuestaUsuario = document.getElementById('captcha-input').value.trim().toLowerCase();

  if (!captchaActual) {
    inicializarCaptcha();
    return;
  }

  if (respuestaUsuario === captchaActual.respuesta) {
    document.getElementById('captcha-overlay').style.display = 'none';
    audioBoot();
  } else {
    document.getElementById('captcha-error').textContent = '❌ Respuesta incorrecta. Intenta de nuevo.';
    document.getElementById('captcha-input').value = "";
    inicializarCaptcha();
  }
}

// Agregar listeners de eventos de forma segura para CSP
document.addEventListener('DOMContentLoaded', function() {
  limpiarLocalStorage();
  inicializarCaptcha();

  document.getElementById('captcha-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      verificarCaptcha();
    }
  });

  document.querySelector('.captcha-btn').addEventListener('click', verificarCaptcha);
});

// Funciones auxiliares (escapeHtml, contienePalabrasProhibidas, etc.)
// … (puedes agregar aquí las funciones completas de tu código original)

// Aquí las funciones para manejar audio, navegación, memes, comentarios también
// (usa las que ya tienes en tu código evitando inline handlers)

window.addEventListener('resize', () => {
  let frasexd = document.getElementById('frase-xd');
  if (frasexd) frasexd.style.fontSize = (window.innerWidth < 700) ? "1em" : "1.10em";
});
