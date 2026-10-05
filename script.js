/* =========================================================
   PESTAÑAS — agregá o quitá una línea acá y el menú se actualiza solo.
   Si una pestaña no tiene <section id="page-ID"> propia en index.html,
   se muestra un cartel genérico de "en construcción".
========================================================= */
const TABS = [
  { id: "inicio",   label: "Inicio" },
  { id: "materias", label: "Materias" },
  { id: "sobre-mi", label: "Sobre mí" },
];

const navList = document.getElementById("navList");
navList.innerHTML = TABS.map(t =>
  `<li><a href="#${t.id}" data-tab="${t.id}">${t.label}</a></li>`
).join("");

/* ---------- router simple por hash, sin recargar la página ---------- */
function goToTab(id){
  const valid = TABS.some(t => t.id === id) ? id : TABS[0].id;
  document.querySelectorAll(".page").forEach(sec => sec.hidden = sec.id !== `page-${valid}`);
  document.querySelectorAll("#tabs a").forEach(a => a.classList.toggle("active", a.dataset.tab === valid));
  if (!document.getElementById(`page-${valid}`)) renderPlaceholder(valid);
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
   MATERIAS — selector de año. Cada año abre su carpeta de Drive.
   Se edita en data/anios.json, nada más.
========================================================= */
fetch("data/anios.json")
  .then(r => r.json())
  .then(anios => {
    const mount = document.getElementById("aniosGrid");
    if (!anios.length){
      mount.innerHTML = `<div class="empty-state">Todavía no hay años cargados en data/anios.json.</div>`;
      return;
    }
    mount.innerHTML = anios
      .sort((a, b) => b.anio - a.anio)
      .map(a => `
        <a class="anio-tile" href="${encodeURI(a.url)}" target="_blank" rel="noopener">
          <span class="num">${a.anio}</span>
          <span class="lbl">Abrir en Drive ↗</span>
        </a>`).join("");
  })
  .catch(() => {
    document.getElementById("aniosGrid").innerHTML =
      `<div class="empty-state">No se pudo cargar data/anios.json. Si estás probando el sitio abriendo el archivo directamente (file://), corré un servidor local (ej: <code>python -m http.server</code>) o probalo ya subido a GitHub Pages.</div>`;
  });

/* ---------- año en el footer + estado inicial ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
goToTab(location.hash.slice(1) || TABS[0].id);
