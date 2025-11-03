// Seguridad clickjacking
if (self !== top) {
  top.location = self.location;
}

// Datos y constantes
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
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(///g, '&#x2F;')
    .replace(/`/g, '&#96;');
}
function contienePalabrasProhibidas(texto) {
  const forbiddenPatterns = [
    /\b(p[úu]t[ao]s?)\b/gi,
    /\b(mierda|mierd[ao])\b/gi,
    /\b(verga|verg[ao])\b/gi,
    /\b(joder|jod[aeio])\b/gi,
    /\b(c[oó]ñ[ao]s?)\b/gi,
    /\b(est[úu]pido|estupid[ao])\b/gi,
    /\b(gilipollas|gilipoll[ae])\b/gi,
    /\b(maric[ao]s?)\b/gi,
    /\b(pendej[ao]s?)\b/gi,
    /\b(culer[ao]s?)\b/gi,
    /\b(idiot[ao]s?)\b/gi,
    /\b(fuck|shit|bitch|asshole)\b/gi
  ];
  return forbiddenPatterns.some(pattern => pattern.test(texto));
}
function contieneCodigoMalicioso(texto) {
  const patronesMaliciosos = [
    /<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>/gi,
    /javascript:/gi,
    /onw+s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /data:/gi,
    /vbscript:/gi
  ];
  return patronesMaliciosos.some(pattern => pattern.test(texto));
}
function sanitizarInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .substring(0, 500)
    .replace(/s+/g, ' ')
    .replace(/[^ws@.-áéíóúñÁÉÍÓÚÑ¿?¡!.,]/gi, '');
}
function validarComentarios(comentarios) {
  if (!Array.isArray(comentarios)) return [];
  return comentarios.filter(comentario => {
    return comentario && 
           typeof comentario.mensaje === 'string' &&
           typeof comentario.emoji === 'string' &&
           comentario.mensaje.length <= 500 &&
           !contienePalabrasProhibidas(comentario.mensaje) &&
           !contieneCodigoMalicioso(comentario.mensaje);
  }).slice(0, 50);
}
function limpiarLocalStorage() {
  const keysPermitidos = ['zoeva_coments'];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!keysPermitidos.includes(key)) {
      localStorage.removeItem(key);
    }
  }
}
function validarEmail(email) {
  const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
  return emailRegex.test(email);
}

// Funciones para audio y efectos
function audioBoot() {
  if (!audioAllowed) {
    let a1 = document.getElementById('audio-burbujas');
    let a2 = document.getElementById('audio-wasaaa');
    let a3 = document.getElementById('audio-ahh');
    try {
      if(a1) { a1.muted = false; a1.volume=1.0; a1.currentTime=0; a1.play().catch(()=>{}); }
      if(a2) { a2.muted = false; a2.volume=1.0; a2.currentTime=0; a2.play().catch(()=>{}); }
      if(a3) { a3.muted = false; a3.volume=1.0; a3.currentTime=0; a3.play().catch(()=>{}); }
      audioAllowed = true;
      setTimeout(()=>{if(a1)a1.pause();if(a2)a2.pause();if(a3)a3.pause();},70);
    } catch(e){}
  }
}
function muestraFraseXD(num) {
  document.getElementById("frase-xd").innerText = FRASES_XD[num-1];
  document.getElementById("frase-xd").style.fontSize = (window.innerWidth<700) ? "1em" : "1.10em";
}
function btnClickSound() {
  audioBoot();
  let a = document.getElementById('audio-burbujas');
  if(a && typeof a.play ==='function') { a.currentTime=0; a.play().catch(()=>{}); }
}
function playSoundAhh() {
  audioBoot();
  let a = document.getElementById('audio-ahh');
  if(a && typeof a.play ==='function') { a.currentTime=0; a.play().catch(()=>{}); }
}

// Navegación
function navAnim(seccion, el) {
  audioBoot();
  btnClickSound();
  let pantallas = ["pantalla-inicio","memesGrid","comentarios","no-tocar-oscuro"];
  pantallas.forEach(id=>{
    let el2 = document.getElementById(id);
    if(el2 && el2.style.display!="none") {
      el2.classList.remove('fade-in');
      el2.classList.add('fade-out');
    }
  });
  setTimeout(()=>{
    pantallas.forEach(id=>{
      let el2 = document.getElementById(id);
      if(el2) { el2.style.display="none"; el2.classList.remove('fade-out'); }
    });
    if(seccion=="home"){document.getElementById("pantalla-inicio").style.display="block";document.getElementById("pantalla-inicio").classList.add('fade-in');}
    if(seccion=="memes"){document.getElementById("memesGrid").style.display="grid";document.getElementById("memesGrid").classList.add('fade-in');renderMemes();}
    if(seccion=="comentarios"){document.getElementById("comentarios").style.display="block";document.getElementById("comentarios").classList.add('fade-in');renderComentarios();}
    if(seccion=="contacto"){renderContacto();document.getElementById('memesGrid').classList.add('fade-in');}
    if(seccion=="notocar"){mostrarNoTocar();}
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
    let idx = ["home","memes","comentarios","contacto","notocar"].indexOf(seccion);
    if(idx>=0) document.querySelectorAll('nav button')[idx].classList.add('active');
  },410);
}

// Render memes
function renderMemes() {
  document.getElementById('comentarios').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display = "none";
  const grid = document.getElementById('memesGrid');
  grid.style.display="grid";
  grid.innerHTML = '';
  MEMES.forEach(meme => {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.onclick = ()=>{ audioBoot(); window.open(RICKROLL_URL,'_blank'); };
    card.innerHTML = `
      <img class="meme-img" src="${escapeHtml(meme.img)}" alt="${escapeHtml(meme.titulo)}" onerror="this.src='${MEME_BACKUP}'" />
      <div class="meme-content">
        <div class="meme-title">${meme.emoji?`<span class="emoji-huge">${escapeHtml(meme.emoji)}</span>`:""} ${escapeHtml(meme.titulo)}</div>
        <div class="meme-desc">${escapeHtml(meme.descripcion)}</div>
      </div>
      <div class="meme-actions">
        <button class="btn-rickroll" onclick="audioBoot();btnClickSound();window.open('${RICKROLL_URL}','_blank');event.stopPropagation();">🎬 Ver Sorpresa</button>
      </div>`;
    grid.appendChild(card);
  });
}

// Render contacto
function renderContacto() {
  document.getElementById('comentarios').style.display = "none";
  document.getElementById('pantalla-inicio').style.display = "none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display = "block";
  document.getElementById('memesGrid').innerHTML = `
    <div style="padding:22px 10px 29px 10px;text-align:center;background:#e5fff2cc;border-radius:17px;max-width:420px;margin:0 auto;">
    <h2 style="font-family:Baloo 2,cursive;color:#1ca87e;font-size:1.21em">Contacto &amp; Newsletter 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas, memes o saludos? <br> Escribe a: <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <form id="contactoForm" style="margin:14px auto;max-width:315px;">
      <input type="email" id="contactoEmail" placeholder="Tu email para memes 🔥" style="padding:10px 12px;width:83%;border-radius:11px;border:2px solid #53E083;font-size:1em;margin-bottom:7px;">
      <button type="submit" style="padding:9px 17px;border:none;background:#21b7a6;color:#fff;border-radius:13px;font-size:1em;cursor:pointer;">Suscribirse 😍</button>
    </form>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
    
  document.getElementById('contactoForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('contactoEmail').value;
    
    if (!validarEmail(email)) {
      alert('❌ Por favor ingresa un email válido');
      return false;
    }
    
    playSoundAhh();
    alert('✅ ¡Gracias por suscribirte! (Esto es una demo)');
    this.reset();
    return false;
  };
}

// Render comentarios
function renderComentarios() {
  let array = [];
  if (localStorage.zoeva_coments) {
    try {
      array = JSON.parse(localStorage.zoeva_coments);
    } catch(e) {
      console.error('Error parsing comments:', e);
      array = [];
    }
  }
  
  const comDiv = document.getElementById('comentarios');
  comDiv.innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos de usuarios</h2>
      <form id="comentarioForm">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
    
  document.getElementById('comentarioForm').onsubmit = guardarComentario;
  mostrarComentarios(array);
}

// Guardar comentario
function guardarComentario(e) {
  e.preventDefault();
  playSoundAhh();
  
  let array = [];
  if (localStorage.zoeva_coments) {
    try {
      array = JSON.parse(localStorage.zoeva_coments);
    } catch(e) {
      array = [];
    }
  }
  
  let texto = sanitizarInput(document.getElementById('comentarioText').value);
  
  if (texto.length < 1) {
    alert("Coloca tu comentario 😎");
    return false;
  }
  
  if (contienePalabrasProhibidas(texto)) {
    alert('❌ El comentario contiene lenguaje inapropiado');
    return false;
  }
  
  if (contieneCodigoMalicioso(texto)) {
    alert('❌ El comentario contiene código potencialmente peligroso');
    return false;
  }
  
  const emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺','🧠','🐸','🍀','🎉','😻'];
  let emoji = emojiList[Math.floor(Math.random()*emojiList.length)];
  
  array.unshift({mensaje:texto,emoji});
  localStorage.zoeva_coments = JSON.stringify(validarComentarios(array));
  document.getElementById('comentarioText').value = "";
  mostrarComentarios(array);
  return false;
}

// Mostrar comentarios
function mostrarComentarios(array) {
  const comentariosValidados = validarComentarios(array);
  const list = document.getElementById('comentariosList');
  
  if (!comentariosValidados || comentariosValidados.length === 0) {
    list.innerHTML = "<i>¡Sé el primero en comentar! 😃</i>";
    return;
  }
  
  list.innerHTML = comentariosValidados.map(c => 
    `<div class="comentario"><span class="com-emoji">${escapeHtml(c.emoji)}</span> ${escapeHtml(c.mensaje)}</div>`
  ).join("");
}

// Mostrar no tocar oscuro
function mostrarNoTocar() {
  audioBoot();
  const container = document.getElementById("no-tocar-oscuro");
  container.style.display = "flex";
  const pasos = [
    {txt:"Acércate",       size:"2.6em"},
    {txt:"Acércate más",   size:"3.8em"},
    {txt:"Un poco más...", size:"2.7em"}
  ];
  container.innerHTML = `<div id="no-tocar-mensaje" class="no-tocar-letra">${escapeHtml(pasos[0].txt)}</div>`;
  let idx = 0;
  function nextStep() {
    idx++;
    if(idx < pasos.length) {
      const msg = document.getElementById("no-tocar-mensaje");
      msg.innerText = pasos[idx].txt;
      msg.style.fontSize = pasos[idx].size;
      audioBoot();
      setTimeout(nextStep, 1800);
    } else setTimeout(asustarWasaaa, 1200);
  }
  setTimeout(nextStep,1800);
}

// Asustar Wasaaa efecto
function asustarWasaaa() {
  audioBoot();
  const container = document.getElementById("no-tocar-oscuro");
  container.innerHTML = `
    <div id="no-tocar-wasaaa">
      <img src="https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/wasaa.jpg" alt="wasaaa" />
      <div class="wasa-text">¡WASAAAA! 😱</div>
      <button onclick="cerrarNoTocar();audioBoot();" style="font-size:1.13em;background:#23e2bb;color:#101;border:none;border-radius:13px;padding:7px 15px;margin-top:18px;cursor:pointer;box-shadow:0 3px 21px #f33a;">
        Volver a la web
      </button>
    </div>
  `;
  let audio = document.getElementById("audio-wasaaa");
  if(audio){ audio.currentTime=0; audio.play().catch(()=>{}); }
  document.body.style.animation = "shake 0.12s 12";
  setTimeout(()=>{document.body.style.animation="";},1000);
}

// Cerrar No Tocar
function cerrarNoTocar() {
  document.getElementById("no-tocar-oscuro").style.display = "none";
  navAnim("home",document.querySelectorAll('nav button')[0]);
}

window.addEventListener('resize', () => {
  let frasexd = document.getElementById('frase-xd');
  if(frasexd) frasexd.style.fontSize = (window.innerWidth < 700)? "1em" : "1.10em";
});
