import service from "./services/api.js"
var carrito
var ValorEnvio 
const CostoEnvioGratis = 35000


// Lista de productos
const productsList = document.getElementById("products-list");

//bar and labels
const shippingProgress = document.querySelector(".shipping-progress");
const shippingLabel = document.querySelector(".shipping-label");
const shippinglabell = document.querySelector(".shipping-labell")

//resume of info of the purchase
const totalPriceProducts = document.querySelector(".priceProducts");
const finalTravelState = document.querySelector(".EnvioState");
const totalPricePurchase = document.querySelector(".TotalPrice");


const summaryCard = document.querySelector(".summary-card");
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
        
        ValorEnvio = 0
        shippingProgress.style.width = "100%"
        shippingLabel.innerHTML = `<p>Posees envio gratis</p>`
        shippingLabel.style.color = "green"
        shippinglabell.innerHTML = ``
        finalTravelState.style.color = "green"
        finalTravelState.innerHTML = `Gratis`
    }else{
        ValorEnvio = precioTotal*0.15
        const valorPorcentual = (precioTotal/CostoEnvioGratis )*100
        
        if (valorPorcentual < 50) {
            
            shippingProgress.style.backgroundColor = "#ff4e50"
        } else if (valorPorcentual < 80) {
            
            shippingProgress.style.backgroundColor = "#ff9f1c"
        } else {
            shippingProgress.style.backgroundColor = "#4caf50"
        }
        
        shippingProgress.style.width = `${valorPorcentual}%`
        shippingLabel.innerHTML =  `<p>$${parseInt(ValorEnvio)}</p>`
        shippinglabell.innerHTML = `<p>Necesitas $${CostoEnvioGratis - precioTotal} para el envio gratis</p>`
        shippingLabel.style.color = "black"; shippingLabel.style.fontSize = "15px"
        finalTravelState.style.color = "black"
        finalTravelState.innerHTML = `$${parseInt(ValorEnvio)}`
        
        
        //totalPriceProducts
        // totalPricePurchase  
    }
    totalPriceProducts.innerHTML = `$${precioTotal}`
    totalPricePurchase.innerHTML = `$${precioTotal + parseInt(ValorEnvio)}`

}

function refreshLabels(Pid){
    const ElementChange = document.getElementById(Pid)
    const ProductChose = carrito.filter( prod => Pid == prod.id)[0]
    ElementChange.querySelector(".quantity-info").innerHTML = `${ProductChose.cantidad}`
    ElementChange.querySelector(".stock-info").innerHTML = `${ProductChose.stock} disponibles`
    ElementChange.querySelector(".price-current").innerHTML = `$ ${ProductChose.precio * ProductChose.cantidad}`
}


