# ProfeDe100cia — sitio web (versión simple)

Sitio estático (HTML/CSS/JS puro) para GitHub Pages. Sin dependencias, sin build.

## Estructura

```
index.html        → la página (nav + una <section> por pestaña)
styles.css        → diseño
script.js         → router de pestañas + carga del selector de año
data/anios.json   → único dato editable: año → link de Drive
```

## Cómo agregar un año nuevo

Editá `data/anios.json` y agregá una línea:

```json
{ "anio": 2027, "url": "https://drive.google.com/tu-link-de-la-carpeta-2027" }
```

Nada más — no hace falta tocar HTML ni ningún otro archivo.

## Agregar o quitar una pestaña del menú

Editá el array `TABS` al principio de `script.js`. Si la pestaña no tiene una
`<section id="page-ID">` propia en `index.html`, se muestra un cartel genérico
de "en construcción" hasta que le agregues contenido.

## Importante

Usa `fetch()` para leer `data/anios.json`, así que **no funciona abriendo
`index.html` con doble clic** (los navegadores bloquean esas cargas locales).
Para probar en tu compu: `python -m http.server` adentro de la carpeta, y
entrar a `http://localhost:8000`. Una vez subido a GitHub Pages, funciona
normal.
