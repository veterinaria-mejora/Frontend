import service, { api } from "../services/api.js";
import authGuard from "../authprovider.js"

function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
document.addEventListener("DOMContentLoaded", async () => {

    const form = qs("#registerForm");
    const regex = /^[^\s@]+@gmail\.com$/i;
    const nameInput = qs("#name");
    const lastnameInput = qs("#lastname");
    const emailInput = qs("#email");
    const passwordInput = qs("#password");
    const msgEl = qs("#msg");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        msgEl.textContent = "";
        const name = nameInput.value.trim();
        const lastname = lastnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        function isValidEmail(email) {
            return regex.test(email);
        }

        if (!isValidEmail(email)) {
            document.getElementById("msg").textContent = "Email inválido";
            return;  
        }

        if (!email || !password) {
            msgEl.textContent = "Completa email y contrasena";
            return;
        }
        console.log(name, lastname, email, password)
        try {
            const response = await service.registerUser(name, lastname, email, password );
                msgEl.textContent = "Registro exitoso";
                setTimeout(() => {
                    window.location.href = "/frontend/vistas/login/login.html";
                }, 1000);
            }
        catch (err) {
            msgEl.textContent = err.message || "Error al registrar";
        }
    });
});
