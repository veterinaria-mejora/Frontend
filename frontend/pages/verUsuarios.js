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
        <h3>${u.nombre} ${u.apellido}</h3>
        <p><strong>Email:</strong> ${u.email}</p>
      `;

      container.appendChild(card);
    });

  } catch (e) {
    console.error(e);
    container.innerHTML = `<p>Error al cargar usuarios</p>`;
  }
}

// Ejecutar al cargar la página
cargarUsuarios();
