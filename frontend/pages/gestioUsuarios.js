import service from "../services/api.js";
import authGuard from "../authprovider.js";

window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarUsuarios()
})

const container = document.querySelector(".usuarios-container");

async function cargarUsuarios() {
    try {
        const res = await service.getUser();

        if (!res.data.ok) {
            throw new Error("Respuesta inválida");
        }

        const usuarios = res.data.data;

        container.innerHTML = "";

        usuarios.forEach(u => {
            const card = document.createElement("div");
            card.classList.add("usuario-card");

            card.innerHTML = `
                <div class="usuario-card">
                <div class="usuario-info">
                    <i class="fa-solid fa-user-circle"></i>

                    <div class="usuario-datos">
                    <div class="usuario-nombre">${u.nombre} - ${u.apellido}</div>
                    <div class="usuario-email">${u.email} - ${u.role}</div>
                    </div>
                </div>

                <button class="btn-eliminar-usuario">
                    Eliminar Usuario
                </button>
                </div>


            `;
            const btn = card.querySelector(".btn-eliminar-usuario");
            btn.addEventListener("click", () => eliminarUsuario(u.id));


            container.appendChild(card);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = `<p>Error al cargar usuarios</p>`;
    }
}

async function eliminarUsuario(id) {
  const confirmacion = confirm(
    "¿Estás seguro de que querés eliminar este usuario?"
  );

  if (!confirmacion) return;

  try {
    await service.deleteUser(id);
    await cargarUsuarios(); // refresca la lista
  } catch (e) {
    console.error("Error al eliminar usuario", e);
    alert("No se pudo eliminar el usuario");
  }
}

// Ejecutar al cargar la página
cargarUsuarios();