import service from "../services/api.js";

const pass1 = document.getElementById("pass1");
const pass2 = document.getElementById("pass2");
const btn = document.getElementById("btn");

const error = document.getElementById("error");
const success = document.getElementById("success");

btn.addEventListener("click", async () => {
    error.style.display = "none";
    success.style.display = "none";
    const token = document.getElementById("token").value
    const p1 = pass1.value.trim();
    const p2 = pass2.value.trim();

    // Validaciones principales
    if (!p1 || !p2 ||!token) {
        mostrarError("Complete todos los campos.");
        return;
    }

    if (p1.length < 6) {
        mostrarError("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (p1 !== p2) {
        mostrarError("Las contraseñas no coinciden.");
        return;
    }

    // Fetch (completás vos)
    try {
        
        await service.changePass(token,p1)

        success.textContent = "Contraseña actualizada correctamente.";
        success.style.display = "block";

        pass1.value = "";
        pass2.value = "";

    } catch (err) {
        mostrarError(err.message);
    }
});

function mostrarError(msg) {
    error.textContent = msg;
    error.style.display = "block";
}
