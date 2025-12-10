import service from "../services/api.js";
import authGuard from "../authprovider.js";

const animalList = document.getElementById("animalList");
const panelHistorial = document.getElementById("panel-historial");

let mascotas = [];
let mascotaSeleccionada = null;

window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarMascotas()
})

function showToast(text, type = "success") {
  const colors = {
    success: "#2ecc71",
    error: "#e74c3c",
  };

  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: colors[type],
    stopOnFocus: true,
  }).showToast();
}


// 1️⃣ Cargar mascotas desde BD
async function cargarMascotas() {
    try {
        const response = await service.register();
        mascotas = response.data.formatted;

        animalList.innerHTML = "";

        if (!mascotas || mascotas.length === 0) {
            animalList.innerHTML = "<p>No hay mascotas registradas.</p>";
            return;
        }

        mascotas.forEach((mascota) => {
            const div = document.createElement("div");
            div.classList.add("animal");
            div.addEventListener("click", () => {
                mostrarHistorial(mascota.id);
            });

            div.innerHTML = `
        <img src="${mascota.foto}" alt="${mascota.nombre}">
        <div>
          <h4>${mascota.nombre}</h4>
          <p>${mascota.tipo} - ${mascota.raza}</p>
        </div>
      `;

            animalList.appendChild(div);
        });
    } catch (e) {
        console.error("Error al cargar mascotas:", e);
    }
}

// 2️⃣ Mostrar historial clínico
function mostrarHistorial(id) {
    mascotaSeleccionada = mascotas.find((m) => m.id === id);

    if (!mascotaSeleccionada) return;

    panelHistorial.innerHTML = `
      <h3>${mascotaSeleccionada.nombre}</h3>
      <img src="${mascotaSeleccionada.foto}">
      <div 
        class="editable" 
        id="textoHistorial" 
        contenteditable="true"
      >
        ${mascotaSeleccionada.desc || ""}
      </div>
    <button class="save-btn" id="btnGuardar">
      Guardar cambios
    </button>
  `;
    document
        .getElementById("btnGuardar")
        .addEventListener("click", guardarHistorial);
}



// 3️⃣ Guardar historial clínico (PUT updatePet)
async function guardarHistorial() {
    if (!mascotaSeleccionada) return;

    const nuevaDescripcion =
        document.getElementById("textoHistorial").innerText.trim();

    try {
        await service.updatePet(
            mascotaSeleccionada.id,
            mascotaSeleccionada.nombre,
            mascotaSeleccionada.tipo,
            mascotaSeleccionada.raza,
            mascotaSeleccionada.edad,
            nuevaDescripcion,
            mascotaSeleccionada.foto,
            mascotaSeleccionada.adoptable
        );

        // Actualizar en memoria
        mascotaSeleccionada.desc = nuevaDescripcion;

        showToast("Historial clínico actualizado correctamente ✅", "success");
    } catch (e) {
        console.error("Error al actualizar historial:", e);
        showToast("Error al guardar el historial ❌", "error");
    }
}

// 4️⃣ Inicializar
cargarMascotas();

