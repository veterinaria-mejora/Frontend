import service from "../services/api.js";
import authGuard from "../authprovider.js";

const listaProductos = document.getElementById("lista-productos");


let carrito = [];

window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard();
    if (!ok) return;

    await cargarProductos();

});


// ===========================
// FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS
// ===========================
async function cargarProductos() {
    try {
        const response = await service.getProducts();

        console.log("DEBUG productos:", response.data);

        const productos = response.data?.data;  // <<--- ESTA ES LA CLAVE

        listaProductos.innerHTML = "";

        if (!Array.isArray(productos) || productos.length === 0) {
            listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        productos.forEach(p => renderProducto(p));

    } catch (error) {
        console.error("Error cargando productos:", error);
        listaProductos.innerHTML = "<p>Error al cargar productos.</p>";
    }
}


// ===========================
// RENDERIZAR CADA PRODUCTO
// ===========================
function renderProducto(prod) {
    const card = document.createElement("div");
    card.className = "producto-card";
    console.log(prod)
    card.innerHTML = `
        <img src="${prod.url_imagen}" class="producto-img">
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion || ""}</p>
        <p class="precio">$${prod.precio}</p>
        <button class="btn-add">Agregar al carrito</button>
    `;

    card.querySelector(".btn-add").addEventListener("click", async() => {
        try {
            await service.addProductCart(prod.id,1)
            console.log("producto agregado al carrito")
            
        } catch (error) {
           
            
        }
    })

    listaProductos.appendChild(card);
}