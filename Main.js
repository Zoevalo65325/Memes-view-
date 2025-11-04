// main.js CSP-Ready

// ========================
// CONFIGURACIÓN DE SUPABASE
// ========================
const supabaseUrl = "https://TU_PROYECTO.supabase.co";
const supabaseKey = "TU_PUBLIC_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ========================
// DATOS ESTÁTICOS
// ========================
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

// ========================
// AUDIO Y EFECTOS
// ========================
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

// ========================
// MEMES Y FRASES
// ========================
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
        <button class="btn-rickroll" type="button">🎬 Ver Sorpresa</button>
      </div>`;
    grid.appendChild(card);
    // CLIC seguro para el botón "Ver Sorpresa"
    let rickBtn = card.querySelector('.btn-rickroll');
    if (rickBtn) rickBtn.addEventListener("click", function(e) {
      audioBoot(); btnClickSound(); window.open(RICKROLL_URL,'_blank'); e.stopPropagation();
    });
  });
}

// ========================
// COMENTARIOS SUPABASE + SEGURIDAD
// ========================
async function renderComentarios() {
  document.getElementById('memesGrid').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display = "none";
  document.getElementById('comentarios').style.display = "block";
  document.getElementById('comentarios').innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos de usuarios</h2>
      <form id="comentarioForm">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button id="comentarioSendBtn" type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
  // Event listener seguro CSP para envío comentario
  const comentarioForm = document.getElementById('comentarioForm');
  if(comentarioForm) comentarioForm.addEventListener('submit', guardarComentario);
  await cargarComentarios();
}

async function guardarComentario(e) {
  if(e) e.preventDefault();
  let mensaje = document.getElementById('comentarioText').value.trim();
  let emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺'];
  let emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  let autor = "público";
  if (typeof antispamDebounce === 'function' && antispamDebounce()) {
    alert("¡Espera antes de enviar otro comentario!");
    return false;
  }
  if(mensaje.length < 1) { alert("Escribe un comentario."); return false; }
  if(mensaje.length > 120) { alert("¡Demasiado largo! Máx 120 caract."); return false; }
  if(typeof contieneGroserias === 'function' && contieneGroserias(mensaje)) {
    alert("¡No se permiten groserías ni palabras negativas!");
    document.getElementById('comentarioText').value = "";
    return false;
  }
  let { data, error } = await supabase
    .from('comentarios')
    .insert([{ mensaje, emoji, autor }]);
  if(error) {
    alert("Error: " + error.message);
    return false;
  }
  document.getElementById('comentarioText').value = "";
  await cargarComentarios();
  return false;
}
async function cargarComentarios() {
  let { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .order('created_at', { ascending: false });
  if(error) {
    document.getElementById('comentariosList').innerHTML = 'Error al cargar comentarios: ' + error.message;
    return;
  }
  document.getElementById('comentariosList').innerHTML =
    data.map(c =>
      `<div class="comentario"><span class="com-emoji">${c.emoji}</span> ${escapeHtml(c.mensaje)}</div>`
    ).join('');
}

// ========================
// CONTACTO
// ========================
function renderContacto() {
  document.getElementById('comentarios').style.display = "none";
  document.getElementById('pantalla-inicio').style.display = "none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display = "block";
  document.getElementById('memesGrid').innerHTML = `
    <div style="padding:22px 10px 29px 10px;text-align:center;background:#e5fff2cc;border-radius:17px;max-width:420px;margin:0 auto;">
    <h2 style="font-family:Baloo 2,cursive;color:#1ca87e;font-size:1.21em">Contacto &amp; Newsletter 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas, memes o saludos? <br> Escribe a: <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <form style="margin:14px auto;max-width:315px;" id="contactForm">
      <input type="email" placeholder="Tu email para memes 🔥" style="padding:10px 12px;width:83%;border-radius:11px;border:2px solid #53E083;font-size:1em;margin-bottom:7px;">
      <button type="submit" style="padding:9px 17px;border:none;background:#21b7a6;color:#fff;border-radius:13px;font-size:1em;cursor:pointer;">Suscribirse 😍</button>
    </form>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
  // Event listener seguro (no envía nada real)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); playSoundAhh();
  });
}

// ========================
// NAVEGACIÓN Y JUMPSCARE
// ========================
function navAnim(seccion, el) {
  audioBoot(); btnClickSound();
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
    if(seccion=="comentarios"){renderComentarios();document.getElementById("comentarios").classList.add('fade-in');}
    if(seccion=="contacto"){renderContacto();document.getElementById('memesGrid').classList.add('fade-in');}
    if(seccion=="notocar"){mostrarNoTocar();}
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
    let idx = ["home","memes","comentarios","contacto","notocar"].indexOf(seccion);
    if(idx>=0) document.querySelectorAll('nav button')[idx].classList.add('active');
  },410);
}
function mostrarNoTocar() { /* ...como antes... */ }
function mostrarBotonSusto() { /* ...como antes... */ }
function asustarWasaaa() { /* ...como antes... */ }
function cerrarNoTocar() { /* ...como antes... */ }

// ========================
// RESPONSIVE
// ========================
window.addEventListener('resize',()=>{
  let frasexd = document.getElementById('frase-xd');
  if(frasexd) frasexd.style.fontSize=(window.innerWidth<700)?"1em":"1.10em";
});

// ========================
// INICIO SEGURO (CAPTCHA)
// ========================
window._mainIniciado = false;
function iniciarPaginaPrincipal() {
  if(window._mainIniciado) return;
  window._mainIniciado = true;
  if(typeof muestraFraseXD === "function") muestraFraseXD(Math.floor(Math.random()*9+1));
  navAnim('home', document.getElementById('nav-home'));
}
window.iniciarPaginaPrincipal = iniciarPaginaPrincipal; // Para globalidad/captcha

// ========================
// ENLAZADO FINALMENTE TODOS LOS BOTONES (NAV Y RICKROLL) CSP READY
// ========================
function enlazarBotonesCSP() {
  let navIds = ["home","memes","comentarios","contacto","notocar"];
  navIds.forEach(function(s) {
    let btn = document.getElementById("nav-"+s);
    if(btn) btn.addEventListener("click", function(){ navAnim(s, btn); });
  });
}
// LLAMA ESTO DESDE EL SCRIPT FINAL DEL HTML (ya está en el ejemplo anterior)
