// Escapa HTML para evitar XSS
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"']/g, m => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Normaliza texto
function normalizaTexto(t) {
  if (typeof t !== 'string') return '';
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, '');
}

// Palabras ofensivas
const forbiddenWords = [
  "puta","puto","mierda","verga","coño","gilipollas","pendejo","culero","zorra","carajo","cabrón","imbecil","idiota","estúpido","marica","huevon","perra","gonorrea","boludo","pelotudo","fuck","shit","bitch","ass","dick","bastard"
];

function contieneGroserias(texto) {
  texto = normalizaTexto(texto);
  return forbiddenWords.some(word => texto.includes(normalizaTexto(word)));
}

// Antispam
let ultimoEnvio = 0;
function antispamDebounce(segundos = 2) {
  let ahora = Date.now();
  if (ahora - ultimoEnvio < segundos*1000) return true;
  ultimoEnvio = ahora;
  return false;
}

// Bloquea iframe
if (window.top !== window.self) {
  document.body.innerHTML = '<h2>No se permite embeber esta página.</h2>';
}
