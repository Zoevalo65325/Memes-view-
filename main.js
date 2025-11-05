// ===== SEGURIDAD Y CONFIGURACIÓN =====
const forbiddenWords = [
    'puta','puto','mierda','verga','joder','coño','idiota','estúpido','gilipollas',
    'marica','pendejo','culero','fuck','shit','bitch','asshole','faggot','bastard',
    'dick','cunt','motherfucker','slut','dumb','stupid','jerk','moron','idiot',
    'gay','homo','retard','fool','foolish','suck','sucker','bollocks','bollock',
    'cabron','imbecil','imbécil','zorra','lame','huevon','huevón','perra','culiao','pelotudo','mongol','polla'
];

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
let userHasCommented = false;
let captchaAttempts = 0;
const MAX_CAPTCHA_ATTEMPTS = 5;
let captchaBlockTime = null;

// ===== FUNCIONES DE SEGURIDAD =====
function escapeHtml(str) {
  return str.replace(/[<>"']/g, function(m) {
    return {'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

function sanitizeEmail(email) {
  return email.trim().replace(/[^a-zA-Z0-9@._-]/g, '');
}

function sanitizeComment(text) {
  return text.trim().substring(0, 120);
}

function generateHash(str) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

function checkUserHasCommented() {
  const userHash = generateHash(navigator.userAgent + navigator.language);
  const commentedUsers = JSON.parse(localStorage.getItem('zoeva_commented_users') || '[]');
  return commentedUsers.includes(userHash);
}

function markUserAsCommented() {
  const userHash = generateHash(navigator.userAgent + navigator.language);
  const commentedUsers = JSON.parse(localStorage.getItem('zoeva_commented_users') || '[]');
  if (!commentedUsers.includes(userHash)) {
    commentedUsers.push(userHash);
    localStorage.setItem('zoeva_commented_users', JSON.stringify(commentedUsers));
    userHasCommented = true;
  }
}

// ===== CAPTCHA MEJORADO =====
function verificarCaptcha(answer) {
  if(captchaBlockTime && Date.now() < captchaBlockTime) {
    const remainingTime = Math.ceil((captchaBlockTime - Date.now()) / 1000);
    document.getElementById('captcha-feedback').innerText = `Espera ${remainingTime}s antes de intentar de nuevo 🔒`;
    return;
  }

  if(answer === '4') {
    document.getElementById('captcha-overlay').style.display = 'none';
    captchaAttempts = 0;
    audioBoot();
  } else {
    captchaAttempts++;
    const feedback = document.getElementById('captcha-feedback');
    if(captchaAttempts >= MAX_CAPTCHA_ATTEMPTS) {
      captchaBlockTime = Date.now() + 30000;
      feedback.innerText = '¡Demasiados intentos! Espera 30 segundos 🚫';
    } else {
      feedback.innerText = `❌ Incorrecto. Intentos: ${captchaAttempts}/${MAX_CAPTCHA_ATTEMPTS}`;
    }
  }
}

// ===== AUDIO =====
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

function muestraFraseXD(num) {
  document.getElementById("frase-xd").innerText = FRASES_XD[num-1];
  document.getElementById("frase-xd").style.fontSize = (window.innerWidth<700) ? "1em" : "1.10em";
}

// ===== NAVEGACIÓN =====
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

// ===== MEMES =====
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
      <img class="meme-img" src="${meme.img}" alt="${escapeHtml(meme.titulo)}" onerror="this.src='${MEME_BACKUP}'" />
      <div class="meme-content">
        <div class="meme-title">${meme.emoji?`<span class="emoji-huge">${escapeHtml(meme.emoji)}</span>`:""} ${escapeHtml(meme.titulo)}</div>
        <div class="meme-desc">${escapeHtml(meme.descripcion)}</div>
      </div>
      <div class="meme-actions">
        <button class="btn-rickroll">🎬 Ver Sorpresa</button>
      </div>`;
    card.querySelector(".btn-rickroll").addEventListener("click", function(e){
      audioBoot();btnClickSound();window.open(RICKROLL_URL,'_blank');e.stopPropagation();
    });
    grid.appendChild(card);
  });
}

// ===== CONTACTO =====
function renderContacto() {
  document.getElementById('comentarios').style.display = "none";
  document.getElementById('pantalla-inicio').style.display = "none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display = "block";
  document.getElementById('memesGrid').innerHTML = `
    <div style="padding:22px 10px 29px 10px;text-align:center;background:#e5fff2cc;border-radius:17px;max-width:420px;margin:0 auto;">
    <h2 style="font-family:Baloo 2,cursive;color:#1ca87e;font-size:1.21em">Contacto &amp; Newsletter 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas, memes o saludos? <br> Escribe a: <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <form style="margin:14px auto;max-width:315px;" id="formContacto">
      <input type="email" id="contactEmail" placeholder="Tu email para memes 🔥" style="padding:10px 12px;width:83%;border-radius:11px;border:2px solid #53E083;font-size:1em;margin-bottom:7px;" required>
      <button type="submit" style="padding:9px 17px;border:none;background:#21b7a6;color:#fff;border-radius:13px;font-size:1em;cursor:pointer;">Suscribirse 😍</button>
    </form>
    <div id="contactFeedback" style="font-size:0.9em;color:#18697d;margin-top:10px;"></div>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
  document.getElementById("formContacto").addEventListener("submit", function(e) {
    e.preventDefault();
    let email = document.getElementById('contactEmail').value;
    let sanitized = sanitizeEmail(email);
    if(/^[^s@]+@[^s@]+.[^s@]+$/.test(sanitized)) {
      playSoundAhh();
      document.getElementById('contactFeedback').innerText = '✅ ¡Email válido! Gracias por suscribirte 🎉';
      document.getElementById('contactEmail').value = '';
      setTimeout(() => { document.getElementById('contactFeedback').innerText = ''; }, 3000);
    } else {
      document.getElementById('contactFeedback').innerText = '❌ Por favor ingresa un email válido';
    }
  });
}

// ===== COMENTARIOS =====
function renderComentarios() {
  userHasCommented = checkUserHasCommented();
  let array = [];
  if (localStorage.zoeva_coments) array = JSON.parse(localStorage.zoeva_coments);
  const comDiv = document.getElementById('comentarios');
  comDiv.innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos de usuarios</h2>
      <form id="comentarioForm">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀" ${userHasCommented ? 'disabled' : ''}></textarea><br>
        <button type="submit" ${userHasCommented ? 'disabled' : ''}>¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentarioFeedback" style="font-size:0.9em;color:#18697d;margin:10px 0;"></div>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
  
  if(userHasCommented) {
    document.getElementById('comentarioFeedback').innerText = '✅ Ya has dejado tu comentario. Un comentario por usuario 🎉';
  }

  document.getElementById('comentarioForm').addEventListener("submit", guardarComentario);
  mostrarComentarios(array);
}

function guardarComentario(e) {
  e.preventDefault();
  
  if(userHasCommented) {
    document.getElementById('comentarioFeedback').innerText = '⚠️ Ya has comentado una vez';
    return;
  }

  playSoundAhh();
  let array = [];
  if (localStorage.zoeva_coments) array = JSON.parse(localStorage.zoeva_coments);
  let texto = sanitizeComment(document.getElementById('comentarioText').value);
  let lower = texto.toLowerCase();
  let found = forbiddenWords.some(word=> lower.includes(word));
  
  if (found) {
    document.getElementById('comentarioFeedback').innerText = '🚫 Palabras no permitidas';
    return;
  }
  if (texto.length<1) {
    document.getElementById('comentarioFeedback').innerText = '⚠️ Escribe algo 😎';
    return;
  }

  const emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺','🧠','🐸','🍀','🎉','😻'];
  let emoji = emojiList[Math.floor(Math.random()*emojiList.length)];
  array.unshift({mensaje: texto, emoji});
  localStorage.zoeva_coments = JSON.stringify(array.slice(0,20));
  markUserAsCommented();
  
  document.getElementById('comentarioText').disabled = true;
  document.querySelector('#comentarioForm button').disabled = true;
  document.getElementById('comentarioFeedback').innerText = '✅ ¡Tu comentario fue publicado! 🎉';
  
  setTimeout(() => {
    mostrarComentarios(array);
  }, 500);
}

function mostrarComentarios(array) {
  const list = document.getElementById('comentariosList');
  if (!array || array.length == 0) {
    list.innerHTML = "<i>¡Sé el primero en comentar! 😃</i>";
    return;
  }
  list.innerHTML = array.map(c=>
    `<div class="comentario"><span class="com-emoji">${escapeHtml(c.emoji)}</span> ${escapeHtml(c.mensaje)}</div>`
  ).join("");
}

// ===== SECCIÓN NO TOCAR =====
function mostrarNoTocar() {
  audioBoot();
  const container = document.getElementById("no-tocar-oscuro");
  container.style.display = "flex";
  const pasos = [
    {txt:"Acércate",       size:"2.6em"},
    {txt:"Acércate más",   size:"3.8em"},
    {txt:"Un poco más...", size:"2.7em"}
  ];
  container.innerHTML = `<div id="no-tocar-mensaje" class="no-tocar-letra">${pasos[0].txt}</div>`;
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

function asustarWasaaa() {
  audioBoot();
  const container = document.getElementById("no-tocar-oscuro");
  container.innerHTML = `
    <div id="no-tocar-wasaaa">
      <img src="https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/wasaa.jpg" alt="wasaaa" />
      <div class="wasa-text">¡WASAAAA! 😱</div>
      <button id="volver-web-btn" style="font-size:1.13em;background:#23e2bb;color:#101;border:none;border-radius:13px;padding:7px 15px;margin-top:18px;cursor:pointer;box-shadow:0 3px 21px #f33a;">
        Volver a la web
      </button>
    </div>
  `;
  let audio = document.getElementById("audio-wasaaa");
  if(audio){ audio.currentTime=0; audio.play().catch(()=>{}); }
  document.body.style.animation = "shake 0.12s 12";
  setTimeout(()=>{document.body.style.animation="";},1000);
  document.getElementById("volver-web-btn").addEventListener("click", function(){ cerrarNoTocar();audioBoot(); });
}

function cerrarNoTocar() {
  document.getElementById("no-tocar-oscuro").style.display = "none";
  navAnim("home", document.getElementById('nav-home'));
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  // Captcha
  document.querySelectorAll('.captcha-option').forEach(btn => {
    btn.addEventListener('click', function() {
      verificarCaptcha(this.getAttribute('data-answer'));
    });
  });

  // Navegación
  document.getElementById("nav-home").addEventListener("click", function(e) { navAnim('home', this); });
  document.getElementById("nav-memes").addEventListener("click", function(e) { navAnim('memes', this); });
  document.getElementById("nav-comentarios").addEventListener("click", function(e) { navAnim('comentarios', this); });
  document.getElementById("nav-contacto").addEventListener("click", function(e) { navAnim('contacto', this); });
  document.getElementById("notocar-btn").addEventListener("click", function(e) { navAnim('notocar', this); });

  // Teclado de números
  document.querySelectorAll(".num-teclado button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      audioBoot(); muestraFraseXD(this.getAttribute("data-num")); btnClickSound();
    });
  });

  // Resize listener
  window.addEventListener('resize', () => {
    let frasexd = document.getElementById('frase-xd');
    if(frasexd) frasexd.style.fontSize = (window.innerWidth<700) ? "1em" : "1.10em";
  });
});
