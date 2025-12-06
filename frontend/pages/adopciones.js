import service from "../services/api.js";
import authGuard from "../authprovider.js"

const listaMascotas = document.getElementById("listaMascotas");
const listaAdopciones = document.getElementById("listaAdopciones");
const avisoPerfil = document.getElementById("avisoPerfil");

const motivo = document.getElementById("motivo");
const btnSolicitar = document.getElementById("btnSolicitar");

const form = document.getElementById("formularioAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");

const inputNombre = document.getElementById("inputNombre");                                     
const inputTipo = document.getElementById("inputTipo");
const inputRaza = document.getElementById("inputRaza");
const inputEdad = document.getElementById("inputEdad");
const inputEspecie = document.getElementById("inputEspecie");
const inputFoto = document.getElementById("inputFoto");
const inputAdoptable = document.getElementById("inputAdoptable");

const filtroAdoptables = document.getElementById("filtroAdoptables");


let mascotaSeleccionada = null;


window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarMascotas()
})

// ======================================================================
// FUNCIÓN PRINCIPAL: CARGAR MASCOTAS
// ======================================================================
async function cargarMascotas() {
    try {
        const response = await service.register();
        const data = response.data.formatted;

        listaMascotas.innerHTML = "";
        listaAdopciones.innerHTML = "";

        if (!data || data.length === 0) {
            avisoPerfil.style.display = "block";
            return;
        }

        avisoPerfil.style.display = "none";

        data.forEach((mascota) => {
            renderMascotaSelector(mascota);
            renderMascotaAdopcion(mascota);
        });
    } catch (e) {
        console.log("Error al cargar mascotas:", e);
    }
}

// ======================================================================
// MOSTRAR MASCOTAS EN LA COLUMNA IZQUIERDA (SELECTOR)
// ======================================================================
function renderMascotaSelector(m) {
    const card = document.createElement("div");

    card.className = "miniMascota";
    card.style.cursor = "pointer";
    card.style.display = "inline-flex";
    card.style.alignItems = "center";
    card.style.gap = "8px";
    card.style.padding = "8px 12px";
    card.style.margin = "4px";
    card.style.background = "#e6f4ec";
    card.style.borderRadius = "6px";

    card.innerHTML = `
        <img src="${m.imagen_m || "https://img.freepik.com/vector-premium/kit-medico-accesorios_24640-56132.jpg"}" 
             width="40" 
             height="40"
             style="border-radius:50%; object-fit:cover;">
        <span>${m.nombre}</span>
    `;

    // Registrar clic para seleccionar
    card.addEventListener("click", () => {
        console.log(mascotaSeleccionada)
        mascotaSeleccionada = m;
        console.log(mascotaSeleccionada)
        marcarSeleccion(card);
    });

    listaMascotas.appendChild(card);
}

const eliminar = document.getElementById("btnLimpiar");

eliminar.addEventListener("click", async () => {
    if (!mascotaSeleccionada) {
        console.log("No hay ninguna mascota seleccionada");
        return;
    }

    try {
        const response = await service.deletePet(mascotaSeleccionada.id);

        console.log("Mascota eliminada:", response.data);

        // Quitar de la interfaz
        cargarMascotas();   // recarga el listado
        mascotaSeleccionada = null;
    } catch (err) {
        console.error("Error eliminando mascota:", err);
    }
});



function marcarSeleccion(card) {
    const todas = listaMascotas.querySelectorAll(".miniMascota");
    todas.forEach((c) => {
        c.style.border = "2px solid transparent";
        c.style.background = "#e6f4ec";
    });

    card.style.border = "2px solid #007bff";
    card.style.background = "#d6ebff";
}

// ======================================================================
// MOSTRAR MASCOTAS EN LA COLUMNA DERECHA (LISTA FILTRABLE)
// ======================================================================
function renderMascotaAdopcion(m) {
    const lista = document.createElement("div");
    lista.className = "animalItem";
    lista.dataset.adoptable = m.adoptable ? "1" : "0";

    lista.innerHTML = `
        <h4>${m.nombre}</h4>
        <p>${m.tipo} - ${m.raza}</p>
        <p>Edad: ${m.edad}</p>
        <p>Adoptable: ${m.adoptable ? "Sí" : "No"}</p>
    `;

    listaAdopciones.appendChild(lista);
    aplicarFiltro();
}

// ======================================================================
// FILTRO DE "VER SOLO ADOPTABLES"
// ======================================================================
filtroAdoptables.addEventListener("change", () => aplicarFiltro());

function aplicarFiltro() {
    const items = listaAdopciones.querySelectorAll(".animalItem");

    items.forEach((i) => {
        if (filtroAdoptables.checked) {
            i.dataset.adoptable === "1"
                ? (i.style.display = "block")
                : (i.style.display = "none");
        } else {
            i.style.display = "block";
        }
    });
}

// ======================================================================
// AGREGAR MASCOTA
// ======================================================================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = inputNombre.value;
    const tipo = inputTipo.value;
    const raza = inputRaza.value;
    const edad = Number(inputEdad.value);
    const especie = inputEspecie.value;
    const foto = inputFoto.value;
    const adoptable = inputAdoptable.checked;

    try {
        const response = await service.addPet(
            nombre,
            tipo,
            raza,
            edad,
            especie,
            foto,
            adoptable
        );

        console.log("Mascota agregada:", response.data);

        form.reset();
        await cargarMascotas();
    } catch (e) {
        console.log("Error al agregar mascota:", e);
    }
});

// ======================================================================
// LIMPIAR FORMULARIO
// ======================================================================
btnLimpiar.addEventListener("click", () => {
    form.reset();
});

// ======================================================================
// LOS GRAFICOS WILLY!!!!
// ======================================================================