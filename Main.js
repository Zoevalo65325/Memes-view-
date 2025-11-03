// ============================================
// CONFIGURACIÓN SEGURA Y DATA
// ============================================
const forbiddenWords = [
  'puta','puto','mierda','verga','joder','coño','idiota','estúpido','gilipollas',
  'marica','pendejo','culero','fuck','shit','bitch','asshole','faggot','bastard',
  'dick','cunt','motherfucker','slut','dumb','stupid','jerk','moron','idiot',
  'gay','homo','retard','fool','foolish','suck','sucker','bollocks','bollock',
  'cabron','imbecil','zorra','lame','huevon','perra','culiao','pelotudo','mongol','polla'
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
let debounceTimer = 0;

// ============================================
// FUNCIONES SEGURAS DE SANITIZACIÓN
// ============================================
// SOLO TEXTO PLANO - Sin HTML
function soloTextoPlano(str) {
  if (typeof str !== 'string') return '';
  let div = document.createElement('div');
  div.innerText = str;
  return div.innerText;
}

// NORMALIZAR TEXTO PARA FILTRO (sin espacios, acentos, minúsculas)
function normalizaTexto(t) {
  if (typeof t !== 'string') return '';
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-záéíóúñ0-9]/g, '');
}

// ESCAPE HTML MEJORADO (por si acaso)
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"']/g, function(m) {
    return {'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

// ============================================
// AUDIO Y CAPTCHA
// ============================================
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

function verificarCaptcha() {
  let respuesta = document.getElementById('captcha-input').value.trim().toLowerCase();
  if(respuesta === '4' || respuesta === 'cuatro') {
    document.getElementById('captcha-overlay').style.display = 'none';
    audioBoot();
  } else {
    alert('¡Intenta de nuevo! 🤔 Pista: 2 + 2 = ?');
  }
}

// ============================================
// FRASES Y MEMES
// ============================================
function muestraFraseXD(num) {
  let frase = FRASES_XD[num-1] || FRASES_XD[0];
  document.getElementById("frase-xd").innerText = frase;
  document.getElementById("frase-xd").style.fontSize = (window.innerWidth<700) ? "1em" : "1.10em";
}

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
        <div class="meme-title">${meme.emoji?`<span class="emoji-huge">${meme.emoji}</span>`:""} ${escapeHtml(meme.titulo)}</div>
        <div class="meme-desc">${escapeHtml(meme.descripcion)}</div>
      </div>
      <div class="meme-actions">
        <button class="btn-rickroll" onclick="audioBoot();btnClickSound();window.open('${RICKROLL_URL}','_blank');event.stopPropagation();">🎬 Ver Sorpresa</button>
      </div>`;
    grid.appendChild(card);
  });
}

// ============================================
// COMENTARIOS CON SEGURIDAD
// ============================================
function renderComentarios() {
  let array = [];
  if (localStorage.zoeva_coments) {
    try {
      array = JSON.parse(localStorage.zoeva_coments);
      if(!Array.isArray(array)) array = [];
    } catch(e) {
      array = [];
    }
  }
  const comDiv = document.getElementById('comentarios');
  comDiv.innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos de usuarios</h2>
      <form id="comentarioForm" onsubmit="guardarComentario(event)">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
  mostrarComentarios(array);
}

function guardarComentario(e) {
  e.preventDefault();
  
  // DEBOUNCE: evita spam rápido
  if(Date.now() - debounceTimer < 1000) {
    alert('¡Espera un segundo antes de enviar otro! 😅');
    return false;
  }
  debounceTimer = Date.now();

  playSoundAhh();
  let array = [];
  if (localStorage.zoeva_coments) {
    try {
      array = JSON.parse(localStorage.zoeva_coments);
      if(!Array.isArray(array)) array = [];
    } catch(e) {
      array = [];
    }
  }
  
  let texto = document.getElementById('comentarioText').value.trim();
  
  // VALIDACIÓN: no vacío
  if (texto.length < 1) {
    alert("Coloca tu comentario 😎");
    return false;
  }
  
  // FILTRO ROBUSTO: normaliza y busca palabras prohibidas
  let found = forbiddenWords.some(word => normalizaTexto(texto).includes(normalizaTexto(word)));
  if (found) {
    alert('¡No se permiten palabras ofensivas ni groserías! 😬');
    document.getElementById('comentarioText').value = "";
    return false;
  }
  
  // LIMITA CANTIDAD: máximo 20 comentarios
  if(array.length >= 20) {
    array = array.slice(0, 19);
  }
  
  // GUARDA SEGURO
  const emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺','🧠','🐸','🍀','🎉','😻'];
  let emoji = emojiList[Math.floor(Math.random()*emojiList.length)];
  array.unshift({
    mensaje: soloTextoPlano(texto),
    emoji: emoji
  });
  
  try {
    localStorage.zoeva_coments = JSON.stringify(array.slice(0,20));
  } catch(e) {
    alert('Error al guardar. Local Storage lleno.');
    return false;
  }
  
  document.getElementById('comentarioText').value = "";
  mostrarComentarios(array);
}

function mostrarComentarios(array) {
  const list = document.getElementById('comentariosList');
  if (!array || array.length == 0) {
    list.innerHTML = "<i>¡Sé el primero en comentar! 😃</i>";
    return;
  }
  list.innerHTML = array.map(c=>`<div class="comentario"><span class="com-emoji">${c.emoji}</span> ${soloTextoPlano(c.mensaje)}</div>`).join("");
}

// ============================================
// CONTACTO
// ============================================
function renderContacto() {
  document.getElementById('comentarios').style.display = "none";
  document.getElementById('pantalla-inicio').style.display = "none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display = "block";
  document.getElementById('memesGrid').innerHTML = `
    <div style="padding:22px 10px 29px 10px;text-align:center;background:#e5fff2cc;border-radius:17px;max-width:420px;margin:0 auto;">
    <h2 style="font-family:Baloo 2,cursive;color:#1ca87e;font-size:1.21em">Contacto &amp; Newsletter 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas, memes o saludos? <br> Escribe a: <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <form style="margin:14px auto;max-width:315px;" onsubmit="playSoundAhh();return false;">
      <input type="email" placeholder="Tu email para memes 🔥" style="padding:10px 12px;width:83%;border-radius:11px;border:2px solid #53E083;font-size:1em;margin-bottom:7px;">
      <button type="submit" style="padding:9px 17px;border:none;background:#21b7a6;color:#fff;border-radius:13px;font-size:1em;cursor:pointer;">Suscribirse 😍</button>
    </form>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
}

// ============================================
// NAVEGACIÓN
// ============================================
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

// ============================================
// JUMPSCARE CON BOTÓN "ESTOY LISTX"
// ============================================
function mostrarNoTocar() {
  audioBoot();
  const container = document.getElementById("no-tocar-oscuro");
  container.style.display = "flex";
  const pasos = [
    {txt:"Acércate", size:"2.6em"},
    {txt:"Acércate más", size:"3.8em"},
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
    } else {
      setTimeout(()=>mostrarBotonSusto(), 1200);
    }
  }
  setTimeout(nextStep,1800);
}

function mostrarBotonSusto() {
  const container = document.getElementById("no-tocar-oscuro");
  container.innerHTML = `<div class="no-tocar-letra">¿Listx?<br>
    <button style="margin-top:20px;font-size:1.4em;background:#fc8181;color:#fff;padding:15px 40px;border-radius:18px;font-family:'Luckiest Guy',cursive;border:none;box-shadow:0 7px 24px #fc818163;cursor:pointer;"
      onclick="asustarWasaaa()">Estoy listx 😱</button></div>`;
}

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

function cerrarNoTocar() {
  document.getElementById("no-tocar-oscuro").style.display = "none";
  navAnim("home",document.querySelectorAll('nav button')[0]);
}

// ============================================
// RESPONSIVE
// ============================================
window.addEventListener('resize',()=>{
  let frasexd = document.getElementById('frase-xd');
  if(frasexd) frasexd.style.fontSize=(window.innerWidth<700)?"1em":"1.10em";
});
