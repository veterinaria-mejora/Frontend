// RECUPERAR CONTRASEÑA
const API = "http://localhost:3001";
const regex = /^[^\s@]+@gmail\.com$/i;
import authGuard from "./authprovider.js"
window.addEventListener("DOMContentLoaded", async (_event)=>{
    const ok = await authGuard()
    if (!ok) return
})
document.getElementById("RecBtn").addEventListener("click", async () => {
    const emailRecuperacion = document.getElementById("RecEmail").value.trim();
    if (!emailRecuperacion) {
        alert("Ingresa un email primero");
        return;
    }

    function isValidEmail(email) {
        return regex.test(email);
    }

    if (!isValidEmail(emailRecuperacion)) {
        document.getElementById("msg").textContent = "Email inválido";
        return;  
    }

    const res = await fetch(API + "/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailRecuperacion })
    });

    await res.json();
    alert("Si existe una cuenta con ese email, se envió el link de recuperación.");
});
