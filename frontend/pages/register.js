/**
 * Página de Registro - Lógica del cliente
 */
import { api } from "../services/api.js";
function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
document.addEventListener("DOMContentLoaded", () => {
    const form = qs("#registerForm");
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
        if (!email || !password) {
            msgEl.textContent = "Completa email y contrasena";
            return;
        }
        try {
            const response = await api.register({ name, lastname, email, password });
            if (response.ok) {
                msgEl.textContent = "Registro exitoso";
                setTimeout(() => {
                    window.location.href = "/frontend/vistas/login/login.html";
                }, 1000);
            }
            else {
                msgEl.textContent = response.error || "Error al registrar";
            }
        }
        catch (err) {
            msgEl.textContent = err.message || "Error de red";
        }
    });
});
