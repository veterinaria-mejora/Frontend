import service from "../services/api.js";
import authGuard from "../authprovider.js"
const API = "http://localhost:3001"; 

const tbody = document.querySelector(".tabla-solicitudes tbody");

window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarFormularios()
})


async function cargarFormularios() {
  try {
    const res = await service.getForm();

    if (!res.data.ok) throw new Error("Respuesta inválida del servidor");

    const formularios = res.data.formularios;

    tbody.innerHTML = "";

    formularios.forEach(f => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td data-label="ID">${f.idformulario}</td>
        <td data-label="Cliente">${f.nombre} ${f.apellido}</td>
        <td data-label="Mascota">${f.tipo || "—"}</td>
        <td data-label="Fecha">${new Date(f.fecha_creacion).toLocaleDateString()}</td>
        <td data-label="Estado">
          <span class="estado ${f.estado.toLowerCase()}">
            ${f.estado}
          </span>
        </td>
        <td data-label="Acciones">
          <button class="btn-ver" data-id="${f.idformulario}">
            Ver
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    asignarEventos();

  } catch (e) {
    console.error("Error cargando formularios:", e);
    tbody.innerHTML = `
      <tr>
        <td colspan="6">Error al cargar solicitudes</td>
      </tr>
    `;
  }
}

// -------------------------
// Eventos
// -------------------------
function asignarEventos() {
  document.querySelectorAll(".btn-ver").forEach(btn => {
    btn.addEventListener("click", () => {
      verFormulario(btn.dataset.id);
    });
  });
}

// -------------------------
// Mostrar detalle (alert por ahora)
// -------------------------
function verFormulario(id) {
  const f = window.formulariosCache.find(x => x.idformulario == id);
  if (!f) return;

  const modal = document.getElementById("formularioModal");
  const fieldsDiv = document.getElementById("modalFields");

  const campos = {
    "Nombre": f.nombre,
    "Apellido": f.apellido,
    "Teléfono": f.telefono,
    "Email": f.mail,
    "Fecha de nacimiento": f.fecha_nacimiento,
    "Dirección": f.direccion,
    "Ciudad": f.ciudad,
    "Provincia": f.provincia,
    "Código Postal": f.codigo_postal,
    "País": f.pais,
    "Tipo Documento": f.tipo_documento,
    "Número Documento": f.numero_documento,
    "Tipo de Vivienda": f.tipo_vivienda,
    "Espacio Seguro": f.espacio_seguro,
    "Tiempo Solo": f.tiempo_solo,
    "Personas en Casa": f.personas_encasa,
    "Familia de Acuerdo": f.familia_deacuerdo,
    "Tuvo otras mascotas antes": f.otras_mascotas_anteriormente,
    "Tiene mascotas actualmente": f.otras_mascotas_actualmente,
    "Tipo mascotas actuales": f.tipo_mascotas_actual,
    "Tipo (Perro/Gato)": f.tipo,
    "Eventos": f.eventos,
    "Recursos disponibles": f.recursos,
    "Vacunar y Esterilizar": f.vacunar_y_esterilizar,
    "Encargado del Cuidado": f.encargado_cuidado,
    "Sitio cuando está solo": f.sitio_animal_solo,
    "Rol del Animal": f.rol_del_animal
  };

  fieldsDiv.innerHTML = Object.entries(campos)
    .map(([label, value]) => `
      <p><strong>${label}:</strong> ${value ?? "No especificado"}</p>
    `)
    .join("");

  // Seleccionar estado actual
  document.getElementById("estadoSelect").value = f.estado;

  // Guardar cambios
  document.getElementById("guardarEstadoBtn").onclick = () => guardarEstado(f.idformulario);

  modal.style.display = "flex";
}

function cerrarModal() {
  document.getElementById("formularioModal").style.display = "none";
}

window.cerrarModal = cerrarModal;


window.onclick = function(event) {
  const modal = document.getElementById("formularioModal");
  if (event.target === modal) cerrarModal();
}

async function guardarEstado(idFormulario) {
  const nuevoEstado = document.getElementById("estadoSelect").value;

  try {
await service.updateFormState(idFormulario, nuevoEstado);


    // Actualizar el cache sin recargar
    const f = window.formulariosCache.find(x => x.idFormulario == idFormulario);
    if (f) f.estado = nuevoEstado;

    alert("Estado actualizado correctamente.");
    cerrarModal();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    alert("No se pudo actualizar el estado.");
  }
}



// -------------------------
// Inicialización
// -------------------------
window.formulariosCache = [];

async function init() {
  const res = await service.getForm();

  if (!res.data.ok) {
    console.error("No se pudo cargar formularios");
    return;
  }

  window.formulariosCache = res.data.formularios;
  cargarFormularios();
}



init();