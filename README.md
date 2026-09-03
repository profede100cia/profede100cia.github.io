# ProfeDe100cia — sitio web

Sitio estático (HTML/CSS/JS puro), pensado para GitHub Pages. Sin frameworks, sin instalación.

## Estructura

```
index.html                          → la página (nav + una <section> por pestaña)
styles.css                          → todo el diseño
script.js                           → router de pestañas + tablas filtrables + carga de datos

data/
  materias.json                     → materiales cargados a mano (ej. links a Google Docs)
  materias-archivos.json            → generado SOLO. No editar a mano: lo arma el robot.
  recursos.json                     → recursos generales (simulaciones, videos, etc.)
  historietas.json                  → imágenes de la sección Historietas

materiales/                         → subís PDF/Word/lo que sea acá, con el nombre:
                                       "Año - Materia - Tema.ext"
                                       ej: "2026 - Fisicoquímica 2º - Las soluciones.pdf"
                                       El robot arma data/materias-archivos.json solo.

assets/                             → imágenes para Historietas (jpg, png, gif animado)

scripts/generar-datos.js            → el script que lee materiales/ y genera el JSON
.github/workflows/generar-datos.yml → el robot (GitHub Actions) que lo corre automático
```

## Cómo agregar contenido

- **Material nuevo (archivo propio):** subilo a `materiales/` con el nombre
  `Año - Materia - Tema.ext`. Esperá ~30s y va a aparecer solo en la pestaña Materias.
  Podés seguirlo en la pestaña **Actions** del repo ("Generar catálogo de materiales").
- **Material que ya está en Google Drive/Docs:** editá `data/materias.json` a mano,
  agregando un objeto `{ "anio": 2026, "materia": "...", "tema": "...", "url": "..." }`.
- **Recurso general:** editá `data/recursos.json` de la misma forma.
- **Imagen de Historieta:** subí el archivo a `assets/`, después agregá una fila en
  `data/historietas.json`: `{ "imagen": "assets/archivo.jpg", "alt": "descripción" }`.
- **Agregar o quitar una pestaña del menú:** editá el array `TABS` al principio de
  `script.js`. Si la pestaña no tiene una `<section>` propia en `index.html`, se
  muestra un cartel genérico de "en construcción" hasta que le agregues una.

## Importante

Este sitio usa `fetch()` para leer los JSON, así que **no funciona abriendo
`index.html` con doble clic** (los navegadores bloquean esas cargas locales por
seguridad). Para probarlo en tu compu: `python -m http.server` adentro de la
carpeta, y entrar a `http://localhost:8000`. Una vez subido a GitHub Pages,
funciona normal.
