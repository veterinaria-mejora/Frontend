import service from "../services/api.js";
import authGuard from "../authprovider.js"



const container = document.getElementById("dogs");
const input = document.getElementById("search");
const filtro = document.getElementById("filter-age");
const botonAdopcion = document.getElementById("btn-adopt");

let mascotas = [];

window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarMascotas()
})

// ---- FETCH ----
async function cargarMascotas() {
  try {
    const res = await service.register();

    mascotas = res.data.formatted;


    renderMascotas(mascotas);
  } catch (err) {
    console.error("Error al cargar mascotas", err);
    container.innerHTML = "<p>Error al cargar mascotas</p>";
  }
}

// ---- RENDER ----
function renderMascotas(lista) {
  container.innerHTML = "";

  lista.forEach((m) => {
    if (m.adoptable && m.adoptable !== true) return;

    const card = document.createElement("article");
    card.className = "dog-card";

    card.innerHTML = `
      <img src="${m.imagen_m}" alt="${m.nombre}" />

      <div class="card-body">
        <h2 class="dog-name">${m.nombre}</h2>

        <p class="meta">
          ${m.raza} · ${m.edad} año${m.edad === 1 ? "" : "s"}
        </p>

        <p class="desc">${m.desc}</p>

        <div class="card-actions">
          <button class="btn adopt" data-id="${m.id}">Adoptar</button>
          <button class="btn details" data-id="${m.id}">Ver detalles</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ---- FILTROS ----
function filtrarMascotas() {
  const texto = input.value.toLowerCase();
  const edad = filtro.value;

  let filtradas = mascotas.filter((m) => {
    const matchTexto =
      m.nombre.toLowerCase().includes(texto) ||
      m.raza.toLowerCase().includes(texto) ||
      String(m.edad).includes(texto);

    let matchEdad = true;

    if (edad === "baby") matchEdad = m.edad <= 1;
    if (edad === "adult") matchEdad = m.edad > 1 && m.edad < 8;
    if (edad === "senior") matchEdad = m.edad >= 8;

    return matchTexto && matchEdad;
  });

  renderMascotas(filtradas);
}

botonAdopcion.addEventListener("click", () => {
    window.location.href = "../vistas/formulario/formulario.html";
});

// ---- EVENTOS ----
input.addEventListener("input", filtrarMascotas);
filtro.addEventListener("change", filtrarMascotas);

// ---- INIT ----
cargarMascotas();
