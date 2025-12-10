import service from "../services/api.js";
import authGuard from "../authprovider.js";
var carrito 

var divCart = document.getElementById("ProductsContainer")
var divPayment = document.getElementById("processPay")
window.addEventListener("DOMContentLoaded", async () => {

    const ok = await authGuard()
    if (!ok) return
    
    await cargarCarrito()
    
    CargarUI()
})

async function cargarCarrito() {
    try {

        const res = await service.getCart()
        console.log(res)

        
        if (res.data.data.items.length == 0) {
            divCart.innerHTML = "<p>No hay productos en tu carrito.</p>";
            return
        }
        
        carrito = res.data.data.items
    } catch (error) {
        divCart.innerHTML = `<p>error cargando el carrito</p>`
        document.getElementsByTagName("body")[0].innerHTML = ""
        return
    }
}

function CargarUI(){
    console.log(carrito)
    carrito.forEach(producto => {
        const card = document.createElement("div");
        card.className = `${producto.id}`
        card.innerHTML = `
        <img src="${producto.imagen || "https://via.placeholder.com/150"}" class="producto-img">
        <h3>${producto.nombre}</h3>
        <p>cant: ${producto.cantidad}</p>
        <p class="precio">precio total $${producto.precio * producto.cantidad}</p>
        <button class="btn-del">eliminar</button>
    `
    card.querySelector(".btn-del").addEventListener("click",async() => {
        await service.deleteItem(producto.id)
        await cargarCarrito()
        realTimeEjecutionModify(producto)
    }) 
    divCart.appendChild(card)
    })
    
}

function realTimeEjecutionModify(producto){
    const divProduct = document.getElementsByClassName(producto.id)[0]
    const product = carrito.filter(item => item.id = producto.id)[0]
    const childrens = divProduct.children
    childrens[2].innerHTML = product.cantidad
    childrens[3].innerHTML = `<p class="precio">precio total $${product.precio * product.cantidad}</p>`
    console.log(product)
    console.log(childrens)
    console.log(divProduct)
}