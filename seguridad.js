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

// Palabras ofensivas, insultos, negativas y polémicas (ampliado por país, región y diminutivos)
const forbiddenWords = [
  // Groserías fundamentales
  "puta","puto","put@", "putita","putito",
  "mierda","verga","coño","gilipollas","pendejo","pendeja","culero","culera",
  "culiao","zorra","zorrilla","carajo","cabrón","cabrona","imbecil","imbécil",
  "idiota","idiotita","estúpido","estupido","estúpida","estupida","marica","maricón","maricona",
  "mariconazo","huevon","huevón","huevona","huevones","perra","perrito","lame","papanatas",
  "gonorrea","gonorreita","guevón","guevona","guevones","vreta","boludo","boluda","pelotudo",
  "pelotuda","concha","culia","culiá","culeado","culeada","culiado","culiada","mongol","mongolo",
  "mongólica","mongolico","retrasado","autista","down",
  // Inglesas y globalizadas
  "fuck","shit","ass","butt","bitch","asshole","dick","dumb","bastard","slut",
  "faggot","bollocks","motherfucker","jerk","dickhead","sucker","loser","wanker",
  // Discriminación y aspectos físicos
  "gordo","gorda","flaco","flaca","obeso","fea","feo","negro","negra","cholo","china","enano","enana",
  "petiso","petisa","retardado","retrasado","lisiado","cojo","coja","cojito","cojita",
  // Ofensivas comunes y diminutivos típicos
  "tonto","tonta","tontito","tontita","tontuelo","tontuela","tontorrón","tontorron",
  "baboso","babosa","babosito","babosilla","bobo","boba","bobito","bobilla",
  "burro","burra","burrito","burrita",
  "torpe","torpón","torpona","tarado","tarada","taradito",
  "pesado","pesada","pesadito","pesadita",
  "loco","loca","loquito","loquita","patan","patán","patancito",
  // Regionalismos fuertes (expande a tu gusto)
  "chingada","chingar","pinche","cabron","joputa","csm","ctm","mierdoso","mierdosa",
  // Más insultos frecuentes
  "animal","bestia","asno","bruja","brujo","cerda","cerdo","tarántula","lagarta","lagarto","parásito",
  "bruji","ñero","ñera","menso","mensito","mensita","imbecilucho",
  // Palabras sociales usadas como insulto
  "maldito","maldita","inútil","inutil","aburrido","aburrida","malcriado","malcriada","grosero","grosera",
  "payaso","payasa","ridículo","ridícula","ridiculillo","ridiculilla","noob","novato","novata"
];

// Revisa si hay alguna grosería o insulto en el texto
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

// Bloquea copiar/cortar (puedes comentar si no lo deseas)
document.addEventListener('copy', function(e) {
  e.preventDefault();
  alert('¡No se permite copiar!');
});
document.addEventListener('cut', function(e) {
  e.preventDefault();
  alert('¡No se permite cortar!');
});
