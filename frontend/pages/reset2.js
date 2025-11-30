/**
 * Página de Reset Password - Lógica del cliente
 */
import { api } from "../services/api.js";
function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
document.addEventListener("DOMContentLoaded", () => {
    const form = qs("#resetForm");
    const passwordInput = qs("#password");
    const confirmInput = qs("#confirm");
    const msgEl = qs("#msg");
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (!token) {
        msgEl.textContent = "Token no válido";
        return;
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        msgEl.textContent = "";
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        if (password !== confirm) {
            msgEl.textContent = "Las contrasenas no coinciden";
            return;
        }
        try {
            const response = await api.resetPassword(token, password);
            if (response.ok) {
                msgEl.textContent = "Contrasena actualizada";
                setTimeout(() => {
                    window.location.href = "/frontend/vistas/login/login.html";
                }, 1000);
            }
            else {
                msgEl.textContent = response.error || "Error";
            }
        }
        catch (err) {
            msgEl.textContent = err.message || "Error de red";
        }
    });
});
