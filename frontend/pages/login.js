import service  from "../services/api.js";


const regex = /^[^\s@]+@gmail\.com$/i


document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    if (!isValidEmail(email)) {
        document.getElementById("msg").textContent = "Email inválido"
        return
    }

    const res = await service.login(email, password)
    console.log(res)
    const data = res.data
    console.log(data)
    if (data.ok) {
        const role = data.data.role 
        const id = data.data.id
        console.log(role)
        console.log(id)
    }
    localStorage.setItem("data",JSON.stringify(data))
    
    console.log(JSON.parse(localStorage.getItem("data")))
});
// IR A REGISTRO
document.getElementById("goRegister").addEventListener("click", () => {
    window.location.href = "../register/register.html";
});


function isValidEmail(email) {
    return regex.test(email);
}