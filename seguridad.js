// seguridad.js

// Escapa HTML para evitar XSS en comentarios, títulos, etc.
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"']/g, m => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Normaliza texto para proteger contra groserías disfrazadas
function normalizaTexto(t) {
  if (typeof t !== 'string') return '';
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, '');
}

// Palabras ofensivas (puedes añadir más)
const forbiddenWords = [
  'puta','mierda','verga','pendejo','culero','fuck','shit','bitch','asshole','idiot','joto','puto'
];

// Revisa si hay alguna grosería en el texto
function contieneGroserias(texto) {
  texto = normalizaTexto(texto);
  return forbiddenWords.some(word => texto.includes(normalizaTexto(word)));
}

// Antispam/debounce: limita envíos rápidos (2 seg de espera)
let ultimoEnvio = 0;
function antispamDebounce(segundos = 2) {
  let ahora = Date.now();
  if (ahora - ultimoEnvio < segundos*1000) return true;
  ultimoEnvio = ahora;
  return false;
}

// Bloquea carga en iframe (contra clickjacking)
if (window.top !== window.self) {
  document.body.innerHTML = '<h2>No se permite embeber esta página.</h2>';
}

// Advierte si falta el meta CSP (solo lo ve el dev en consola)
if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
  console.warn('⚠️ FALTA Content-Security-Policy: Agrega un meta CSP en tu head para máxima seguridad.');
}

// Bloquea botón derecho del mouse (dificulta robo/descarga de imágenes sencilla)
document.addEventListener('contextmenu', function(evt) {
  evt.preventDefault();
}, false);

// Bloquea copiar (si lo deseas, borra si no lo quieres)
document.addEventListener('copy', function(e) {
  e.preventDefault();
  alert('¡No se permite copiar!');
});
