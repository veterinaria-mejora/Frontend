import service  from "../services/api.js";


const regex = /^[^\s@]+@gmail\.com$/i
const button = document.getElementById("loginForm")

button.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    if (!isValidEmail(email)) {
        document.getElementById("msg").textContent = "Email inválido"
        return
    }
    try {
        const res = await service.login(email, password)
        const data = res.data
        window.location.href = "/frontend/vistas/index.html";
        localStorage.setItem("data",JSON.stringify(data.data))
        console.log(JSON.parse(localStorage.getItem("data")))
    } catch (error) {
        console.log(error)
        return
    }
})
// IR A REGISTRO
document.getElementById("goRegister").addEventListener("click", () => {
    window.location.href = "../register/register.html";
});


function isValidEmail(email) {
    return regex.test(email);
}