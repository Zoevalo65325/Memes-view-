// Protege XSS en comentarios y entradas (escapeHtml)
function escapeHtml(str){
  if(typeof str !== 'string') return '';
  return str.replace(/[<>"']/g,m=>({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Evita clickjacking
if(window.top!==window.self){
  document.body.innerHTML='<h2>No se permite embeber esta página.</h2>';
}

// Comentarios: palabras ofensivas (puedes ampliar)
const forbiddenWords=["puta","puto","mierda","verga","coño","gilipollas","idiota","fuck","shit","bitch","marica","culero","pendejo","dick","bollocks","bastard"];

// Funciones de comentarios
function contieneGroserias(texto){
  let lower = texto.toLowerCase();
  return forbiddenWords.some(word => lower.includes(word));
}
