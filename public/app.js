/***** DOM elements *****/
const categoryGrid = document.getElementById("categoryGrid");
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const toolsList = document.getElementById("toolsList");
const closeModalBtn = document.getElementById("closeModal");
const favBar = document.getElementById("favBar");
const openFavsBtn = document.getElementById("openFavs");
const searchInput = document.getElementById("searchInput");
const toolFilter = document.getElementById("toolFilter");

let categories = [];
let currentCategoryId = null;

/***** API helpers *****/
async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error("Request failed: " + res.status);
  }
  return await res.json();
}

/***** Categories UI *****/
function createCategoryCard(cat){
  const el = document.createElement("div");
  el.className = "card";
  el.tabIndex = 0;
  el.setAttribute("role","button");
  el.innerHTML = `
    <div class="icon">${(cat.title || cat.name || "?").charAt(0)}</div>
    <h3>${cat.title || cat.name}</h3>
    <p>${cat.desc || ""}</p>
  `;
  el.addEventListener("click", () => openCategory(cat));
  el.addEventListener("keypress", (e)=> { if(e.key === "Enter") openCategory(cat); });
  return el;
}

function renderCategories(list = categories){
  categoryGrid.innerHTML = "";
  if (!list.length) {
    categoryGrid.innerHTML = '<p style="color:#aaa;font-size:14px">No categories found.</p>';
    return;
  }
  list.forEach(c => categoryGrid.appendChild(createCategoryCard(c)));
}

async function loadCategories(){
  try {
    categories = await fetchJSON("/api/categories");
    renderCategories(categories);
  } catch (err) {
    console.error(err);
    categoryGrid.innerHTML = '<p style="color:#f88;font-size:14px">Failed to load categories. Make sure the backend is running.</p>';
  }
}

/***** Tools UI *****/
async function openCategory(cat){
  modalTitle.textContent = cat.title || cat.name;
  currentCategoryId = cat.id;
  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden","false");
  toolFilter.value = "";
  toolFilter.focus();
  await renderTools(cat.id);
}

function closeModal(){
  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden","true");
  currentCategoryId = null;
}

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e)=> { if(e.target === overlay) closeModal(); });

async function renderTools(catId){
  toolsList.innerHTML = '<div style="color:#bbb;padding:12px;font-size:14px">Loading tools...</div>';
  try {
    const tools = await fetchJSON("/api/tools?category=" + encodeURIComponent(catId || ""));
    toolsList.innerHTML = "";
    if (!tools.length) {
      toolsList.innerHTML = '<div style="color:#bbb;padding:12px;font-size:14px">No tools in this category yet.</div>';
      return;
    }
    tools.forEach(t => {
      const el = document.createElement("div");
      el.className = "tool";
      el.dataset.toolId = t.id;
      el.innerHTML = `
        <div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(180deg,#fff,#e9e9e9);display:flex;align-items:center;justify-content:center;font-weight:700;color:#000">
          ${(t.name || "?").charAt(0)}
        </div>
        <div class="meta">
          <h4>${t.name}</h4>
          <p>${(t.short || "")} ${t.price ? " · <strong>" + t.price + "</strong>" : ""}</p>
        </div>
        <div class="actions">
          <button class="small-btn">Visit</button>
          <button class="fav" title="Toggle favorite">♡</button>
        </div>
      `;
      const visitBtn = el.querySelector(".small-btn");
      visitBtn.addEventListener("click", () => visitTool(t.url || "#"));
      const favBtn = el.querySelector(".fav");
      favBtn.addEventListener("click", () => toggleFav(t.id, t.name));
      toolsList.appendChild(el);
    });
    refreshFavIcons();
  } catch (err) {
    console.error(err);
    toolsList.innerHTML = '<div style="color:#f88;padding:12px;font-size:14px">Failed to load tools from backend.</div>';
  }
}

function visitTool(url){
  if (!url || url === "#") return;
  window.open(url, "_blank", "noopener");
}

/***** Favorites (localStorage) *****/
function getFavs(){
  try {
    return JSON.parse(localStorage.getItem("ait_favs") || "[]");
  } catch {
    return [];
  }
}

function saveFavs(list){
  localStorage.setItem("ait_favs", JSON.stringify(list));
  refreshFavBar();
  refreshFavIcons();
}

function toggleFav(id, name){
  const favs = getFavs();
  const idx = favs.findIndex(x => x.id === id);
  if (idx === -1) {
    favs.push({ id, name });
  } else {
    favs.splice(idx, 1);
  }
  saveFavs(favs);
}

function refreshFavBar(){
  const favs = getFavs();
  favBar.innerHTML = "";
  if (favs.length === 0){
    favBar.innerHTML = '<small style="color:var(--grey-500)">No favorites yet — add tools you like</small>';
    return;
  }
  favs.forEach(f => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = f.name;
    favBar.appendChild(chip);
  });
}

function refreshFavIcons(){
  const favs = getFavs();
  document.querySelectorAll(".tool").forEach(toolEl => {
    const btn = toolEl.querySelector(".fav");
    if (!btn) return;
    const toolId = toolEl.dataset.toolId;
    const isFav = favs.some(f => f.id === toolId);
    btn.textContent = isFav ? "♥" : "♡";
    btn.style.color = isFav ? "#e11" : "inherit";
  });
}

function removeFav(id){
  const favs = getFavs().filter(x => x.id !== id);
  saveFavs(favs);
}

/***** Search & filter *****/
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    renderCategories(categories);
    return;
  }
  const filtered = categories.filter(c =>
    (c.title || "").toLowerCase().includes(q) ||
    (c.desc || "").toLowerCase().includes(q)
  );
  renderCategories(filtered);
});

toolFilter.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const cards = Array.from(toolsList.children);
  cards.forEach(div => {
    const titleEl = div.querySelector("h4");
    const textEl = div.querySelector("p");
    if (!titleEl || !textEl) return;
    const title = titleEl.textContent.toLowerCase();
    const short = textEl.textContent.toLowerCase();
    const show = !q || title.includes(q) || short.includes(q);
    div.style.display = show ? "flex" : "none";
  });
});

// Favorites quick view
openFavsBtn.addEventListener("click", () => {
  modalTitle.textContent = "Favorites";
  const favs = getFavs();
  toolsList.innerHTML = "";
  if (favs.length === 0){
    toolsList.innerHTML = '<div style="color:#bbb;padding:18px">No favorites — add tools from any category.</div>';
  } else {
    favs.forEach(f => {
      const div = document.createElement("div");
      div.className = "tool";
      div.dataset.toolId = f.id;
      div.innerHTML = `
        <div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(180deg,#fff,#e9e9e9);display:flex;align-items:center;justify-content:center;font-weight:700;color:#000">
          ${f.name.charAt(0)}
        </div>
        <div class="meta">
          <h4>${f.name}</h4>
          <p>Saved to favorites</p>
        </div>
        <div class="actions">
          <button class="small-btn">Remove</button>
        </div>
      `;
      const removeBtn = div.querySelector(".small-btn");
      removeBtn.addEventListener("click", () => {
        removeFav(f.id);
        // Re-open favorites view
        openFavsBtn.click();
      });
      toolsList.appendChild(div);
    });
  }
  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden","false");
});

/***** Init *****/
loadCategories();
refreshFavBar();
