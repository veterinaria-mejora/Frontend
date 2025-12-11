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
        localStorage.setItem("data",JSON.stringify(data.data))
        
        if (data.data.role == "user") {
            window.location.href = "/frontend/vistas/index.html"
            return
        }else if (data.data.role == "doctor"){
            window.location.href = "/frontend/vistas/doc.html"
            return
        }else{
            window.location.href = "/frontend/vistas/admin.html"
            return
        }
    } catch (error) {
        console.log(error)
        return
    }

})


document.getElementById("goRegister").addEventListener("click", () => {
    window.location.href = "../register/register.html";
});


function isValidEmail(email) {
    return regex.test(email);
}