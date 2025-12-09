import service from "./services/api.js"
var carrito
var ValorEnvio 
var envioGratis
const CostoEnvioGratis = 35000


// Lista de productos
const productsList = document.getElementById("products-list");


// Barra de envío
const shippingBarWrap = document.querySelector(".shipping-bar-wrap");
const shippingBar = document.querySelector(".shipping-bar");
const shippingProgress = document.querySelector(".shipping-progress");
const shippingLabel = document.querySelector(".shipping-label");

// Panel lateral resumen
const cartSummary = document.querySelector(".cart-summary");
const summaryCard = document.querySelector(".summary-card");

// Filas del resumen
const summaryRows = summaryCard?.querySelectorAll(".summary-row");
const summaryTotal = summaryCard?.querySelector(".summary-total");

// Botón principal
const btnPrimary = summaryCard?.querySelector(".btn-primary");
const couponLink = summaryCard?.querySelector(".coupon-link");


document.addEventListener("DOMContentLoaded",async ()=>{
    await cargarCarrito()
    await ChargeCartUi()
})

async function ChargeCartUi(){
    console.log(carrito)
    carrito.forEach(product => {
    const div = document.createElement("div")
    div.classList.add("product-card")
    div.id = product.id
    console.log(product.imagen)
    div.innerHTML = `

    <img class="product-img" src="${product.imagen}" alt="img">

    <div class="product-meta">
        <h3 class="product-name">${product.nombre}</h3>

        <div class="product-controls">
            <div class="qty-control">
                <button class="btn-del">-</button>
                <div class="quantity-info">${product.cantidad}</div>
                <button class="btn-add">+</button>
            </div>

            <span class="stock-info">${product.stock} disponibles</span>
        </div>
    </div>

    <div class="product-price">
        <div class="price-current">$ ${product.precio * product.cantidad}</div>
    </div>
`
        productsList.appendChild(div )
        div.querySelector(".btn-add").addEventListener("click",async() => {
            await service.addProductCart(product.id,1)
            await cargarCarrito()
            refreshLabels(product.id)
        })
        div.querySelector(".btn-del").addEventListener("click",async() => {
            await service.deleteItem(product.id)
            await cargarCarrito()
            refreshLabels(product.id)
        })
    })
    

}

async function cargarCarrito() {
    try {

        const res = await service.getCart()

        
        if (res.data.data.items.length == 0) {
            productsList.innerHTML = "<p>No hay productos en tu carrito.</p>";
            return
        }
        
        carrito = res.data.data.items
    } catch (error) {
        productsList.innerHTML = `<p>error cargando el carrito</p>`
        document.getElementsByTagName("body")[0].innerHTML = ""
        return
    }
    const precioTotal = carrito.reduce((acum,product)=> acum + (product.precio * product.cantidad),0)
    if (precioTotal >= CostoEnvioGratis) {
        envioGratis = true
        ValorEnvio = 0
        shippingProgress.style.width = "100%"
    }else{
        envioGratis = false
        ValorEnvio = precioTotal*0.15
        const valorPorcentual = (precioTotal/CostoEnvioGratis )*100
        shippingProgress.style.width = `${valorPorcentual}%`
    }
}
function refreshLabels(Pid){
    const ElementChange = document.getElementById(Pid)
    const ProductChose = carrito.filter( prod => Pid == prod.id)[0]
    ElementChange.querySelector(".quantity-info").innerHTML = `${ProductChose.cantidad}`
    ElementChange.querySelector(".stock-info").innerHTML = `${ProductChose.stock} disponibles`
    ElementChange.querySelector(".price-current").innerHTML = `$ ${ProductChose.precio * ProductChose.cantidad}`
}


