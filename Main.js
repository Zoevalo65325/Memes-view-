// --- CAPTCHA ---
function verificarCaptcha() {
  let respuesta = document.getElementById('captcha-input').value.trim().toLowerCase();
  if(respuesta === '4' || respuesta === 'cuatro') {
    document.getElementById('captcha-overlay').style.display = 'none';
    audioBoot();
  } else {
    alert('¡Intenta de nuevo! 🤔 Pista: 2 + 2 = ?');
    document.getElementById('captcha-input').value = "";
  }
}

// --- DATOS ---
const FRASES_XD = [
  "Mi cara cuando veo pizza gratis... 🤤🍕", "Quise madrugar... mi cama dijo NO. 😴",
  "¿Por qué día lluvioso? ¡Quiero mi sol y mi helado! 🌞🍦", "Desayuné y ya tengo hambre otra vez. 🥞😂",
  "¡Hoy sí hago ejercicio! ...Bueno, mejor mañana 😂🏋️‍♂️", "Me reí tan fuerte que desperté al perro. 🐶🤣",
  "Aplausos para mí: no perdí las llaves hoy. 🗝👏", "¿Quién dejó el modo flojera encendido? 🛋️💤",
  "Hoy no hay tarea, ¿verdad profe? 😶✏️"
];
const MEMES = [
  { titulo:"Chill de cojones 😌", descripcion:"Relajación máxima 💆‍♂️", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/chillde.jpeg", emoji:"😌"},
  { titulo:"Bob Esponja 🤪", descripcion:"¡Burla asegurada! 🍍", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/bob.jpg", emoji:"🤪"},
  { titulo:"Pikachu Sorprendido 😱", descripcion:"¡No me lo esperaba! ⚡", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/pikachu.jpeg", emoji:"⚡"},
  { titulo:"Gato Meme 🐱", descripcion:"¿Miau dices? 😺", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/gato%20meme.jpeg", emoji:"😺"},
  { titulo:"Patrick Malvado 😏", descripcion:"Risa traviesa 🦑", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/patricio.jpg", emoji:"😏"},
  { titulo:"Stonks 💹", descripcion:"Dinero para todos 🤑", img:"https://raw.githubusercontent.com/Zoevalo65325/Memes-view-/refs/heads/main/stonks.jpeg", emoji:"💹"}
];
const RICKROLL_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const MEME_BACKUP="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

// FUNCIONES PRINCIPALES (memes, frases, botones, comentarios)
function muestraFraseXD(num){
  document.getElementById("frase-xd").innerText = FRASES_XD[num-1];
}
function renderMemes(){
  document.getElementById('comentarios').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  const grid = document.getElementById('memesGrid'); grid.style.display="grid"; grid.innerHTML='';
  MEMES.forEach(meme=>{
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.innerHTML = `<img class="meme-img" src="${escapeHtml(meme.img)}" alt="${escapeHtml(meme.titulo)}" onerror="this.src='${MEME_BACKUP}'" />
    <div class="meme-content">
      <div class="meme-title">${meme.emoji?`<span class="emoji-huge">${meme.emoji}</span>`:""} ${escapeHtml(meme.titulo)}</div>
      <div class="meme-desc">${escapeHtml(meme.descripcion)}</div>
    </div>
    <div class="meme-actions">
      <button class="btn-rickroll" type="button">🎬 Ver Sorpresa</button>
    </div>`;
    grid.appendChild(card);
    let rickBtn = card.querySelector('.btn-rickroll');
    if(rickBtn) rickBtn.addEventListener("click",e=>{
      audioBoot(); btnClickSound(); window.open(RICKROLL_URL,'_blank'); e.stopPropagation();
    });
  });
}
function renderContacto(){
  document.getElementById('comentarios').style.display="none";
  document.getElementById('pantalla-inicio').style.display="none";
  document.getElementById('no-tocar-oscuro').style.display="none";
  document.getElementById('memesGrid').style.display="block";
  document.getElementById('memesGrid').innerHTML=`
    <div style="padding:22px 10px;text-align:center;background:rgba(229,255,242,0.8);border-radius:17px;max-width:420px;margin:0 auto;">
    <h2 style="color:#1ca87e;font-size:1.21em">Contacto 💌</h2>
    <p style="color:#18697d;font-weight:700;">¿Ideas o saludos? <b style="color:#21b7a6;">zoevaloprueba@gmail.com</b> 📧</p>
    <div style="font-size:1.59em">💚🦄🎉🤣😂🍀</div>
    </div>`;
}
function renderComentarios(){
  let array = JSON.parse(localStorage.getItem("zoeva_coments")||"[]");
  const comDiv = document.getElementById('comentarios');
  comDiv.innerHTML = `
    <div class="comentarios-section">
      <h2>💬 Comentarios públicos</h2>
      <form id="comentarioForm">
        <textarea id="comentarioText" maxlength="120" placeholder="Escribe aquí tu comentario 😀"></textarea><br>
        <button type="submit">¡Enviar comentario! 🚀</button>
      </form>
      <div id="comentariosList" style="margin-top:10px"></div>
    </div>`;
  const form = document.getElementById('comentarioForm');
  if(form) form.addEventListener('submit',guardarComentario);
  mostrarComentarios(array);
}
function guardarComentario(e){
  e.preventDefault();
  let texto = document.getElementById('comentarioText').value.trim();
  if(contieneGroserias(texto)){ alert('¡No se permiten groserías! 😬');return false; }
  if(texto.length<1){alert("Coloca tu comentario 😎");return false;}
  let array=JSON.parse(localStorage.getItem("zoeva_coments")||"[]");
  const emojis=['🤣','✨','😎','🥳','🤩','🚀','😂','🥇','💥','😺','🧠','🐸','🍀','🎉','😻'];
  let emoji = emojis[Math.floor(Math.random()*emojis.length)];
  array.unshift({mensaje:texto,emoji});
  localStorage.setItem("zoeva_coments",JSON.stringify(array.slice(0,20)));
  document.getElementById('comentarioText').value = "";
  mostrarComentarios(array);
}
function mostrarComentarios(array){
  const list = document.getElementById('comentariosList');
  if(!array||array.length==0){
    list.innerHTML="<i>¡Sé el primero en comentar! 😃</i>";
    return;
  }
  list.innerHTML = array.map(c=>`<div class="comentario"><span class="com-emoji">${c.emoji}</span> ${escapeHtml(c.mensaje)}</div>`).join("");
}

// --- AUDIO ---
let audioAllowed = false;
function audioBoot() {
  if (!audioAllowed) {
    let a1 = document.getElementById('audio-burbujas');
    if(a1){ a1.muted=false; a1.volume=0.5; a1.currentTime=0; a1.play().catch(()=>{});}
    audioAllowed=true;
    setTimeout(()=>{if(a1)a1.pause();},70);
  }
}
function btnClickSound(){
  let a = document.getElementById('audio-burbujas');
  if(a){ a.currentTime=0; a.play().catch(()=>{}); }
}

// --- MENÚ, NÚMERO y EVENTOS ---
window.addEventListener("DOMContentLoaded",function(){
  // CAPTCHA
  document.getElementById('captcha-btn').addEventListener('click',verificarCaptcha);
  document.getElementById('captcha-input').addEventListener('keydown',function(e){if(e.key=="Enter")verificarCaptcha();});
  // TECLADO FRASES
  const teclado=document.getElementById('num-teclado');
  for(let i=1;i<=9;i++){
    const btn=document.createElement('button');
    btn.textContent=i;
    btn.addEventListener('click',function(){audioBoot();muestraFraseXD(i);btnClickSound();});
    teclado.appendChild(btn);
  }
  muestraFraseXD(Math.floor(Math.random()*9+1));
  // NAV
  document.getElementById('btn-home').addEventListener("click",function(){navAnim('home');});
  document.getElementById('btn-memes').addEventListener("click",function(){navAnim('memes');});
  document.getElementById('btn-comentarios').addEventListener("click",function(){navAnim('comentarios');});
  document.getElementById('btn-contacto').addEventListener("click",function(){navAnim('contacto');});
  document.getElementById('notocar-btn').addEventListener("click",function(){navAnim('notocar');});
});
function navAnim(seccion){
  let pantallas=["pantalla-inicio","memesGrid","comentarios","no-tocar-oscuro"];
  pantallas.forEach(id=>{
    let el=document.getElementById(id);
    if(el&&el.style.display!="none"){el.classList.add('fade-out');}
  });
  setTimeout(()=>{
    pantallas.forEach(id=>{
      let el=document.getElementById(id);
      if(el){el.style.display="none";el.classList.remove('fade-out');}
    });
    if(seccion=="home"){document.getElementById("pantalla-inicio").style.display="block";}
    if(seccion=="memes"){document.getElementById("memesGrid").style.display="grid";renderMemes();}
    if(seccion=="comentarios"){document.getElementById("comentarios").style.display="block";renderComentarios();}
    if(seccion=="contacto"){renderContacto();}
    if(seccion=="notocar"){mostrarNoTocar();}
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
    document.getElementById('btn-'+seccion).classList.add('active');
  },420);
}
// NO TOCAR (simplificado)
function mostrarNoTocar() {
  document.getElementById('no-tocar-oscuro').style.display = "flex";
  document.getElementById('no-tocar-oscuro').innerHTML = `<div class="no-tocar-letra">¡No deberías estar aquí! 😱<br><button id="cerrarNotocar" style="margin-top:27px;">Quitar</button></div>`;
  document.getElementById('cerrarNotocar').onclick = function(){
    document.getElementById('no-tocar-oscuro').style.display = "none";
    navAnim('home');
  }
}
