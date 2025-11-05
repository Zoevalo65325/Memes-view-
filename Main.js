// DATOS ESTÁTICOS
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
let comentariosData = [];

// AUDIO
function audioBoot() {
  if (!audioAllowed) {
    let a1 = document.getElementById('audio-burbujas');
    if(a1) { a1.muted = false; a1.volume=0.5; a1.currentTime=0; a1.play().catch(()=>{}); }
    audioAllowed = true;
    setTimeout(()=>{if(a1)a1.pause();},70);
  }
}
function btnClickSound() {
  audioBoot();
  let a = document.getElementById('audio-burbujas');
  if(a) { a.currentTime=0; a.play().catch(()=>{}); }
}
function playSoundAhh() {
  audioBoot();
  let a = document.getElementById('audio-ahh');
  if(a) { a.currentTime=0; a.play().catch(()=>{}); }
}

// FRASES
function muestraFraseXD(num) {
  let frase = FRASES_XD[num-1] || FRASES_XD[0];
  document.getElementById("frase-xd").innerText = frase;
}

// MEMES
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
    card.innerHTML = `
      <img class="meme-img" src="${escapeHtml(meme.img)}" alt="${escapeHtml(meme.titulo)}" onerror="this.src='${MEME_BACKUP}'" />
      <div class="meme-content">
        <div class="meme-title">${meme.emoji?`<span class="emoji-huge">${meme.emoji}</span>`:""} ${escapeHtml(meme.titulo)}</div>
        <div class="meme-desc">${escapeHtml(meme.descripcion)}</div>
      </div>
      <div class="meme-actions">
        <button class="btn-rickroll" type="button">🎬 Ver Sorpresa</button>
      </div>`;
    grid.appendChild(card);
    let rickBtn = card.querySelector('.btn-rickroll');
    if (rickBtn) rickBtn.addEventListener("click", function(e) {
      audioBoot(); btnClickSound(); window.open(RICKROLL_URL,'_blank'); e.stopPropagation();
    });
  });
}

// COMENTARIOS (SIN SUPABASE, LOCAL)
function renderComentarios() {
  document.getElementById('memesGrid').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display = "none";
  document.getElementById('comentarios').style.display = "block";
  document.getElementById('comentarios').innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos (Guardados localmente)</h2>
      <form id="comentarioForm">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button id="comentarioSendBtn" type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:15px"></div>
    </div>`;
  const comentarioForm = document.getElementById('comentarioForm');
  if(comentarioForm) comentarioForm.addEventListener('submit', guardarComentario);
  cargarComentarios();
}

function guardarComentario(e) {
  if(e) e.preventDefault();
  let mensaje = document.getElementById('comentarioText').value.trim();
  let emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺'];
  let emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  if (antispamDebounce()) {
    alert("¡Espera antes de enviar otro comentario!");
    return false;
  }
  if(mensaje.length < 1) { alert("Escribe un comentario."); return false; }
  if(mensaje.length > 120) { alert("¡Demasiado largo! Máx 120 caract."); return false; }
  if(contieneGroserias(mensaje)) {
    alert("¡No se permiten groserías!");
    document.getElementById('comentarioText').value = "";
    return false;
  }
  comentariosData.push({ mensaje, emoji });
  document.getElementById('comentarioText').value = "";
  cargarComentarios();
  return false;
}

function cargarComentarios() {
  document.getElementById('comentariosList').innerHTML =
    comentariosData.map(c =>
      `<div class="comentario"><span class="com-emoji">${c.emoji}</span> ${escapeHtml(c.mensaje)}</div>`
    ).join('');
}

// CONTACTO
function renderContacto() {
  document.getElementById('comentarios').style.display = "none";
  document.getElementById('pantalla-inicio').style.display = "none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display = "block";
  document.getElementById('memesGrid').innerHTML = `
    <div style="padding:30px 15px;text-align:center;background:rgba(229,255,242,0.8);border-radius:17px;max-width:450px;margin:0 auto;">
    <h2 style="font-family:Baloo 2,cursive;color:#1ca87e;font-size:1.4em">Contacto 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas, memes o saludos? <br> Escribe a: <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <div style="font-size:2em;margin-top:15px">💚🦄🎉🤣😂🍀</div>
    </div>`;
}

// NAVEGACIÓN
function navAnim(seccion, el) {
  audioBoot(); btnClickSound();
  let pantallas = ["pantalla-inicio","memesGrid","comentarios","no-tocar-oscuro"];
  pantallas.forEach(id=>{
    let el2 = document.getElementById(id);
    if(el2 && el2.style.display!="none") {
      el2.classList.add('fade-out');
    }
  });
  setTimeout(()=>{
    pantallas.forEach(id=>{
      let el2 = document.getElementById(id);
      if(el2) { el2.style.display="none"; el2.classList.remove('fade-out'); }
    });
    if(seccion=="home"){document.getElementById("pantalla-inicio").style.display="block";document.getElementById("pantalla-inicio").classList.add('fade-in');}
    if(seccion=="memes"){document.getElementById("memesGrid").style.display="grid";renderMemes();}
    if(seccion=="comentarios"){renderComentarios();}
    if(seccion=="contacto"){renderContacto();}
    if(seccion=="notocar"){mostrarNoTocar();}
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
    if(el) el.classList.add('active');
  },420);
}

// NO TOCAR (JUMPSCARE)
function mostrarNoTocar() {
  document.getElementById('no-tocar-oscuro').style.display = "flex";
  document.getElementById('no-tocar-oscuro').innerHTML = '<div class="no-tocar-letra">¿Seguro que quieres tocar? 😱</div><button id="btn-si-tocar" style="background:#ff4848;color:#fff;font-size:1.3em;padding:12px 30px;border:none;border-radius:15px;cursor:pointer;font-family:Baloo 2,cursive;">Sí, quiero tocar</button>';
  document.getElementById('btn-si-tocar').addEventListener('click', asustarWasaaa);
}

function asustarWasaaa() {
  playSoundAhh();
  let wasaImg = "https://i.kym-cdn.com/photos/images/newsfeed/000/284/922/0e3.png";
  document.getElementById('no-tocar-oscuro').innerHTML = `<div id="no-tocar-wasaaa"><img src="${wasaImg}" alt="WASAAA"><div class="wasa-text">¡WASAAA! 😂</div><button id="cerrar-wasaaa" style="margin-top:20px;background:#21e75a;color:#fff;padding:10px 25px;border:none;border-radius:12px;font-size:1.1em;cursor:pointer;font-family:Baloo 2;">Cerrar</button></div>`;
  document.getElementById('cerrar-wasaaa').addEventListener('click', cerrarNoTocar);
}

function cerrarNoTocar() {
  document.getElementById('no-tocar-oscuro').style.display = "none";
  navAnim('home', document.getElementById('nav-home'));
}

// EVENTOS NAV
window.addEventListener("DOMContentLoaded", function() {
  muestraFraseXD(Math.floor(Math.random()*9+1));
  document.getElementById('nav-home').addEventListener("click", function(){ navAnim('home', this); });
  document.getElementById('nav-memes').addEventListener("click", function(){ navAnim('memes', this); });
  document.getElementById('nav-comentarios').addEventListener("click", function(){ navAnim('comentarios', this); });
  document.getElementById('nav-contacto').addEventListener("click", function(){ navAnim('contacto', this); });
  document.getElementById('nav-notocar').addEventListener("click", function(){ navAnim('notocar', this); });
});

// RESPONSIVE
window.addEventListener('resize',()=>{
  let frasexd = document.getElementById('frase-xd');
  if(frasexd) frasexd.style.fontSize=(window.innerWidth<700)?"1em":"1.2em";
});
