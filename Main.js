// main.js

// ========================
// CONFIGURACIÓN DE BASE DE DATOS SUPABASE
// ========================
const supabaseUrl = "https://wpavcocrchcuautnindu.supabase.co";
const supabaseKey = "process.env.SUPABASE_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ========================
// CONFIGURACIÓN DE DATOS ESTÁTICOS
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
// AUDIO, EFECTOS, Y CAPTCHAS
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
// FRASES Y MEMES
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
        <button class="btn-rickroll" onclick="audioBoot();btnClickSound();window.open('${RICKROLL_URL}','_blank');event.stopPropagation();">🎬 Ver Sorpresa</button>
      </div>`;
    grid.appendChild(card);
  });
}

// ========================
// COMENTARIOS (SUPABASE + SEGURIDAD)
// ========================

// Carga de comentarios al entrar al sitio o al cambiar de pestaña
async function renderComentarios() {
  document.getElementById('memesGrid').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display = "none";
  document.getElementById('comentarios').style.display = "block";
  document.getElementById('comentarios').innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos de usuarios</h2>
      <form id="comentarioForm" onsubmit="guardarComentario(event)">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
  await cargarComentarios();
}

async function guardarComentario(e) {
  if(e) e.preventDefault();
  let mensaje = document.getElementById('comentarioText').value.trim();
  let emojiList = ['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺'];
  let emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  let autor = "público";
  // Seguridad
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
  // Guardar en Supabase
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
    <form style="margin:14px auto;max-width:315px;" onsubmit="playSoundAhh();return false;">
      <input type="email" placeholder="Tu email para memes 🔥" style="padding:10px 12px;width:83%;border-radius:11px;border:2px solid #53E083;font-size:1em;margin-bottom:7px;">
      <button type="submit" style="padding:9px 17px;border:none;background:#21b7a6;color:#fff;border-radius:13px;font-size:1em;cursor:pointer;">Suscribirse 😍</button>
    </form>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
}

// ========================
// NAVEGACIÓN
// ========================
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
    if(seccion=="comentarios"){renderComentarios();document.getElementById("comentarios").classList.add('fade-in');}
    if(seccion=="contacto"){renderContacto();document.getElementById('memesGrid').classList.add('fade-in');}
    if(seccion=="notocar"){mostrarNoTocar();}
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
    let idx = ["home","memes","comentarios","contacto","notocar"].indexOf(seccion);
    if(idx>=0) document.querySelectorAll('nav button')[idx].classList.add('active');
  },410);
}

// ========================
// JUMPSCARE / SUSTO
// ========================
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

// ========================
// RESPONSIVE
// ========================
window.addEventListener('resize',()=>{
  let frasexd = document.getElementById('frase-xd');
  if(frasexd) frasexd.style.fontSize=(window.innerWidth<700)?"1em":"1.10em";
});

// ========================
// INICIALIZAR PÁGINA (cuando captcha permita acceso)
// ========================
window._mainIniciado = false;
function iniciarPaginaPrincipal() {
  if(window._mainIniciado) return;
  window._mainIniciado = true;
  if(typeof muestraFraseXD === "function") muestraFraseXD(Math.floor(Math.random()*9+1));
  navAnim('home', document.querySelectorAll('nav button')[0]);
}
