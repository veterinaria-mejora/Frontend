import service from "../services/api.js"


const form = document.getElementById("form-producto")

form.addEventListener("submit",async (e)=>{
    e.preventDefault()
    await SendForm()
})

async function SendForm() {
    const inputNombre = document.getElementById("nombre").value.trim();
    const inputPrecio = document.getElementById("precio").value.trim();
    const inputStock = document.getElementById("stock").value.trim();
    const inputUrlImagen = document.getElementById("url_imagen").value.trim();
    try {
        await service.addProduct(inputNombre,inputPrecio,inputStock,inputUrlImagen)
        console.log("Producto enviado")
    } catch (error) {
        console.log("Error al enviar:", error.response.data.error)
    }
}