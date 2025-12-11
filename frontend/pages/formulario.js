import service from "../services/api.js";

const form = document.getElementById("adopcionForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await service.addForm(
      form.nombre.value,
      form.apellido.value,
      form.telefono.value,
      form.mail.value,
      form.fecha_nacimiento.value,
      form.direccion.value,
      form.ciudad.value,
      form.provincia.value,
      form.codigo_postal.value,
      form.pais.value,
      form.tipo_documento.value,
      form.numero_documento.value,
      form.tipo_vivienda.value,
      form.espacio_seguro.value,
      form.tiempo_solo.value,
      form.personas_encasa.value,
      form.familia_deacuerdo.value,
      form.otras_mascotas_anteriormente.value,
      form.tipo.value,
      form.otras_mascotas_actualmente.value,
      form.tipo_mascotas_actual.value,
      form.eventos.value,
      form.recursos.value,
      form.vacunar_y_esterilizar.value,
      form.encargado_cuidado.value,
      form.sitio_animal_solo.value,
      form.rol_del_animal.value,
      "pendiente" // Estado inicial del formulario
    );

    alert("Formulario enviado correctamente.");
    form.reset();

  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    alert("Hubo un error al enviar el formulario.");
  }
});
