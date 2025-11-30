/**
 * Página de Adopciones - Lógica del cliente
 */
import { api } from "../services/api.js";
function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
const listaMascotasEl = qs("#listaMascotas");
const listaAdopcionesEl = qs("#listaAdopciones");
const formulario = qs("#formularioAgregar");
const inputNombre = qs("#inputNombre");
const inputEspecie = qs("#inputEspecie");
const inputFoto = qs("#inputFoto");
const inputAdoptable = qs("#inputAdoptable");
const filtroAdoptables = qs("#filtroAdoptables");
const avisoPerfil = qs("#avisoPerfil");
let mascotas = [];
function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
}
async function cargarMascotas() {
    try {
        const response = await api.getPets();
        if (response.ok && response.data) {
            mascotas = response.data;
        }
        else {
            console.warn("No se pudieron cargar las mascotas:", response.error);
            mascotas = [];
        }
    }
    catch (err) {
        console.error("Error al cargar mascotas:", err);
        mascotas = [];
    }
    actualizarVistas();
}
function renderizarSelector(lista) {
    listaMascotasEl.innerHTML = "";
    if (lista.length === 0) {
        avisoPerfil.style.display = "block";
    }
    else {
        avisoPerfil.style.display = "none";
    }
    for (const m of lista) {
        const div = document.createElement("div");
        div.className = "mascota";
        div.dataset.id = m.id;
        const img = document.createElement("img");
        img.src = m.foto && m.foto.trim() !== "" ? m.foto : `https://via.placeholder.com/120x78?text=${encodeURIComponent(m.nombre)}`;
        const name = document.createElement("small");
        name.textContent = m.nombre;
        div.appendChild(img);
        div.appendChild(name);
        div.addEventListener("click", () => {
            const previo = listaMascotasEl.querySelector(".mascota.seleccionada");
            if (previo)
                previo.classList.remove("seleccionada");
            div.classList.add("seleccionada");
        });
        listaMascotasEl.appendChild(div);
    }
}
function renderizarAdopciones(lista) {
    listaAdopcionesEl.innerHTML = "";
    if (lista.length === 0) {
        const p = document.createElement("div");
        p.textContent = "No hay animales para mostrar.";
        listaAdopcionesEl.appendChild(p);
        return;
    }
    for (const m of lista) {
        const item = document.createElement("div");
        item.className = "cardAdop";
        item.dataset.id = m.id;
        const img = document.createElement("img");
        img.src = m.foto && m.foto.trim() !== "" ? m.foto : `https://via.placeholder.com/120x78?text=${encodeURIComponent(m.nombre)}`;
        const info = document.createElement("div");
        info.style.flex = "1";
        info.innerHTML = `<strong>${escapeHtml(m.nombre)}</strong><br><small>${escapeHtml(m.especie)} ${m.adoptable ? "• Adoptable" : ""}</small>`;
        const acciones = document.createElement("div");
        acciones.style.display = "flex";
        acciones.style.gap = "6px";
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "boton";
        btnEliminar.addEventListener("click", () => {
            eliminarMascota(m.id);
        });
        acciones.appendChild(btnEliminar);
        item.appendChild(img);
        item.appendChild(info);
        item.appendChild(acciones);
        listaAdopcionesEl.appendChild(item);
    }
}
async function agregarMascotaDesdeFormulario(ev) {
    if (ev)
        ev.preventDefault();
    const nombre = inputNombre.value.trim();
    const especie = inputEspecie.value.trim();
    const foto = inputFoto.value.trim();
    const adoptable = inputAdoptable.checked;
    if (!nombre || !especie) {
        alert("Completa nombre y especie");
        return;
    }
    try {
        const response = await api.createPet({ nombre, especie, foto, adoptable });
        if (response.ok) {
            limpiarFormulario();
            await cargarMascotas();
        }
        else {
            alert("Error al agregar mascota: " + (response.error || "Error desconocido"));
        }
    }
    catch (err) {
        alert("Error al agregar mascota: " + (err.message || "Error desconocido"));
    }
}
async function eliminarMascota(id) {
    const mascota = mascotas.find(m => m.id === id);
    if (!mascota)
        return;
    const ok = confirm(`Eliminar a ${mascota.nombre}?`);
    if (!ok)
        return;
    try {
        const response = await api.deletePet(id);
        if (response.ok) {
            await cargarMascotas();
        }
        else {
            alert("Error al eliminar mascota: " + (response.error || "Error desconocido"));
        }
    }
    catch (err) {
        alert("Error al eliminar mascota: " + (err.message || "Error desconocido"));
    }
}
function obtenerListaFiltrada() {
    if (filtroAdoptables.checked) {
        return mascotas.filter(m => m.adoptable);
    }
    return mascotas.slice();
}
function actualizarVistas() {
    const lista = obtenerListaFiltrada();
    renderizarSelector(lista);
    renderizarAdopciones(lista);
}
function limpiarFormulario() {
    inputNombre.value = "";
    inputEspecie.value = "";
    inputFoto.value = "";
    inputAdoptable.checked = false;
}
async function iniciarApp() {
    await cargarMascotas();
    formulario.addEventListener("submit", (e) => {
        agregarMascotaDesdeFormulario(e);
    });
    const btnLimpiar = qs("#btnLimpiar");
    btnLimpiar.addEventListener("click", () => {
        limpiarFormulario();
    });
    filtroAdoptables.addEventListener("change", () => {
        actualizarVistas();
    });
    const btnSolicitar = qs("#btnSolicitar");
    const motivoEl = qs("#motivo");
    btnSolicitar.addEventListener("click", async () => {
        const seleccionado = listaMascotasEl.querySelector(".mascota.seleccionada");
        const motivo = motivoEl.value.trim();
        if (!seleccionado) {
            alert("Seleccioná una mascota antes de solicitar la consulta.");
            return;
        }
        const id = seleccionado.dataset.id;
        const mascota = mascotas.find(m => m.id === id);
        if (!mascota) {
            alert("Mascota no encontrada.");
            return;
        }
        try {
            const response = await api.createAppointment({ petId: mascota.id, motivo });
            if (response.ok) {
                alert("Consulta registrada para " + mascota.nombre + ".");
                motivoEl.value = "";
            }
            else {
                alert("Error al registrar consulta: " + (response.error || "Error desconocido"));
            }
        }
        catch (err) {
            alert("Error al registrar consulta: " + (err.message || "Error desconocido"));
        }
    });
}
document.addEventListener("DOMContentLoaded", iniciarApp);
