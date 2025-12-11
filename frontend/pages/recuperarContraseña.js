import service from "../services/api.js";
const regex = /^[^\s@]+@gmail\.com$/i;

document.getElementById("RecBtn").addEventListener("click", async () => {
    const emailRecuperacion = document.getElementById("RecEmail").value.trim();
    if (!emailRecuperacion) {
        alert("Ingresa un email primero");
        return;
    }

    function isValidEmail(email) {
        return regex.test(email)
    }

    if (!isValidEmail(emailRecuperacion)) {
        document.getElementById("msg").textContent = "Email inválido";
        return;  
    }
    const gaga =await service.forgotedPass(emailRecuperacion)
    console.log(gaga)

    alert("Si existe una cuenta con ese email, se envió el link de recuperación.");
});
