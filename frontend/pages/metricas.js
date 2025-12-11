
  import authGuard from "../authprovider.js"
  import service from "../services/api.js"


  window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    console.log(ok)
    if (!ok) return
    await cargarMetricas()
  })
async function cargarMetricas() {
  try {
    const response = await service.contadores();
    console.log("Respuesta de Axios:", response);

    // Aquí es donde está la info real
    const data = response.data;  

    if (data && data.ok) {
      const elementos = [
        { id: "usuarios", valor: data.totalUsuarios },
        { id: "adopciones", valor: data.totalFormularios },
        { id: "aprobadas", valor: data.totalAceptados },
        { id: "rechazados", valor: data.totalRechazados },
        {id: "mascotas", valor: data.totalMascotas}
      ];

      elementos.forEach(({ id, valor }) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor ?? 0;
        else console.warn(`Elemento con id "${id}" no encontrado en el DOM.`);
      });

    } else {
      console.error("Error al obtener los contadores:", data);
    }

  } catch (err) {
    console.error("Error al llamar a service.contadores():", err);
  }
}


// Ejecutar al cargar la página