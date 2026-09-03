// Lee todos los archivos de materiales/ (recursivo) y genera data/materias-archivos.json
// a partir del NOMBRE de cada archivo, con el formato: "Año - Materia - Tema.ext"
// No abre ni lee el contenido de los archivos, así que funciona igual con PDF, Word, etc.

const fs = require("fs");
const path = require("path");

const CARPETA_ORIGEN = "materiales";
const ARCHIVO_SALIDA = "data/materias-archivos.json";

function listarArchivosRecursivo(dir) {
  let resultado = [];
  if (!fs.existsSync(dir)) return resultado;
  for (const nombre of fs.readdirSync(dir)) {
    if (nombre.startsWith(".")) continue; // ignora .gitkeep y ocultos
    const rutaCompleta = path.join(dir, nombre);
    if (fs.statSync(rutaCompleta).isDirectory()) {
      resultado = resultado.concat(listarArchivosRecursivo(rutaCompleta));
    } else {
      resultado.push(rutaCompleta);
    }
  }
  return resultado;
}

function parsearNombre(nombreArchivo) {
  const sinExtension = nombreArchivo.replace(/\.[^/.]+$/, "");
  const partes = sinExtension.split(" - ").map(p => p.trim());

  if (partes.length === 3) {
    const [anioTexto, materia, tema] = partes;
    const anioNumero = Number(anioTexto);
    return { anio: Number.isNaN(anioNumero) ? anioTexto : anioNumero, materia, tema };
  }
  // si el archivo no sigue el formato esperado, igual lo mostramos para que no quede "perdido"
  return { anio: "—", materia: "Sin clasificar (revisá el nombre del archivo)", tema: sinExtension };
}

const archivos = listarArchivosRecursivo(CARPETA_ORIGEN);

const materias = archivos.map(rutaCompleta => {
  const nombreArchivo = path.basename(rutaCompleta);
  const { anio, materia, tema } = parsearNombre(nombreArchivo);
  return { anio, materia, tema, url: rutaCompleta.split(path.sep).join("/") };
});

fs.mkdirSync(path.dirname(ARCHIVO_SALIDA), { recursive: true });
fs.writeFileSync(ARCHIVO_SALIDA, JSON.stringify(materias, null, 2) + "\n");

console.log(`Listo: generé ${materias.length} fila(s) en ${ARCHIVO_SALIDA}`);
