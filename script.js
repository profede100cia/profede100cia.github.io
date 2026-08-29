/* =========================================================
   CONFIGURACIÓN DE PESTAÑAS
   Para agregar o quitar una pestaña del menú:
   1) Agregá/quitá una línea acá abajo.
   2) Si querés contenido propio (no el genérico "en construcción"),
      agregá un <section id="page-TU-ID" class="page" hidden> en index.html
      con ese mismo id.
   El orden de esta lista define el orden del menú.
========================================================= */
const TABS = [
  { id: "inicio",      label: "Inicio" },
  { id: "materias",    label: "Materias" },
  { id: "recursos",    label: "Recursos" },
  { id: "historietas", label: "Historietas" },
  { id: "sobre-mi",     label: "Sobre mí" },
];

/* ---------- render del menú ---------- */
const navList = document.getElementById("navList");
navList.innerHTML = TABS.map(t =>
  `<li><a href="#${t.id}" data-tab="${t.id}">${t.label}</a></li>`
).join("");

/* ---------- router simple por hash, sin recargar la página ---------- */
function goToTab(id){
  const valid = TABS.some(t => t.id === id) ? id : TABS[0].id;

  document.querySelectorAll(".page").forEach(sec => {
    sec.hidden = sec.id !== `page-${valid}`;
  });
  document.querySelectorAll("#tabs a").forEach(a => {
    a.classList.toggle("active", a.dataset.tab === valid);
  });

  // si la pestaña no tiene <section> propia en el HTML, mostramos un placeholder genérico
  if (!document.getElementById(`page-${valid}`)){
    renderPlaceholder(valid);
  }
  window.scrollTo({top:0, behavior:"instant"});
}

function renderPlaceholder(id){
  const tab = TABS.find(t => t.id === id);
  let holder = document.getElementById("page-generic");
  if (!holder){
    holder = document.createElement("section");
    holder.id = "page-generic";
    holder.className = "page";
    document.querySelector("main").appendChild(holder);
  }
  holder.hidden = false;
  holder.innerHTML = `
    <div class="wrap">
      <div class="section-head"><span class="period">Nueva pestaña</span><h2>${tab.label}</h2></div>
      <p class="section-sub">Todavía no tiene contenido propio. Agregá un &lt;section id="page-${id}"&gt; en index.html para personalizarla.</p>
    </div>`;
}

window.addEventListener("hashchange", () => goToTab(location.hash.slice(1)));

/* ---------- menú responsive ---------- */
const toggle = document.getElementById("navToggle");
toggle.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
navList.addEventListener("click", () => {
  navList.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
});

/* =========================================================
   TABLA FILTRABLE GENÉRICA
   La usan tanto "Materias" como "Recursos".
========================================================= */
function renderFilterableTable({ mountId, filtersId, data, filterKeys, columns }){
  const mount = document.getElementById(mountId);
  const filtersEl = document.getElementById(filtersId);

  // arma los <select> de filtro a partir de los valores únicos de cada filterKey
  filtersEl.innerHTML = filterKeys.map(fk => {
    const values = [...new Set(data.map(row => row[fk.key]).filter(Boolean))].sort();
    return `<select data-filter-key="${fk.key}">
      <option value="">${fk.label}: todos</option>
      ${values.map(v => `<option value="${v}">${v}</option>`).join("")}
    </select>`;
  }).join("");

  function draw(){
    const active = {};
    filtersEl.querySelectorAll("select").forEach(sel => {
      if (sel.value) active[sel.dataset.filterKey] = sel.value;
    });

    const rows = data.filter(row =>
      Object.entries(active).every(([k, v]) => row[k] === v)
    );

    if (rows.length === 0){
      mount.innerHTML = `<div class="empty-state">No hay filas que coincidan con ese filtro.</div>`;
      return;
    }

    mount.innerHTML = `
      <table class="data-table">
        <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join("")}<th>Material</th></tr></thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${columns.map(c => `<td>${row[c.key] ?? ""}</td>`).join("")}
              <td>${row.url
                ? `<a class="open-link" href="${row.url}" target="_blank" rel="noopener">Abrir ↗</a>`
                : `<span class="no-link">sin cargar</span>`}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  }

  filtersEl.querySelectorAll("select").forEach(sel => sel.addEventListener("change", draw));
  draw();
}

/* =========================================================
   HISTORIETAS: filmstrip de imágenes leído desde data/historietas.json
========================================================= */
function renderHistorietas(items){
  const film = document.getElementById("historietasFilm");
  const withImage = items.filter(i => i.imagen);

  if (withImage.length === 0){
    film.innerHTML = `<div class="empty-state">Todavía no hay imágenes cargadas. Subí un jpg o gif a assets/ y agregalo en data/historietas.json.</div>`;
    return;
  }

  film.innerHTML = withImage.map(i => `
    <div class="frame frame--img">
      <img src="${i.imagen}" alt="${i.alt ?? ""}" loading="lazy">
    </div>`).join("");
}

/* ---------- carga de datos (el "JSON como base de datos") ---------- */
Promise.all([
  fetch("data/materias.json").then(r => r.json()),
  fetch("data/recursos.json").then(r => r.json()),
  fetch("data/historietas.json").then(r => r.json()),
]).then(([materias, recursos, historietas]) => {
  renderFilterableTable({
    mountId: "materiasTable",
    filtersId: "materiasFilters",
    data: materias,
    filterKeys: [{ key: "anio", label: "Año" }, { key: "materia", label: "Materia" }],
    columns: [{ key: "anio", label: "Año" }, { key: "materia", label: "Materia" }, { key: "tema", label: "Tema" }],
  });

  renderFilterableTable({
    mountId: "recursosTable",
    filtersId: "recursosFilters",
    data: recursos,
    filterKeys: [{ key: "categoria", label: "Categoría" }],
    columns: [{ key: "categoria", label: "Categoría" }, { key: "nombre", label: "Nombre" }, { key: "descripcion", label: "Descripción" }],
  });

  renderHistorietas(historietas);
}).catch(err => {
  console.error("No se pudieron cargar los datos:", err);
  document.getElementById("materiasTable").innerHTML =
    `<div class="empty-state">No se pudo cargar data/materias.json. Si estás probando el sitio abriendo el archivo directamente (file://), corré un servidor local (ej: <code>python -m http.server</code>) o probalo ya subido a GitHub Pages.</div>`;
});

/* ---------- año en el footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- estado inicial ---------- */
goToTab(location.hash.slice(1) || TABS[0].id);
