import service from "../services/api.js";
import authGuard from "../authprovider.js";

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const listaProductos = document.getElementById("lista-productos");
const carritoDiv = document.getElementById("carrito");
const totalSpan = document.getElementById("total");

const cuponInput = document.getElementById("cupon");
const btnAplicarCupon = document.getElementById("aplicar-cupon");
const msgCupon = document.getElementById("msg-cupon");

const btnVaciar = document.getElementById("vaciar");

// Carrito en memoria    
let carrito = [];
let descuento = 0;

// ===========================
// INICIO
// ===========================
window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard();
    if (!ok) return;

    await cargarProductos();
    renderCarrito();
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

    card.innerHTML = `
        <img src="${prod.imagen || "https://via.placeholder.com/150"}" class="producto-img">
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion || ""}</p>
        <p class="precio">$${prod.precio}</p>
        <button class="btn-add">Agregar al carrito</button>
    `;

    card.querySelector(".btn-add").addEventListener("click", () => {
        agregarAlCarrito(prod);
    });

    listaProductos.appendChild(card);
}

// ===========================
// AGREGAR PRODUCTO AL CARRITO
// ===========================
function agregarAlCarrito(prod) {
    const existe = carrito.find((p) => p.id === prod.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    renderCarrito();
}

// ===========================
// RENDER CARRITO
// ===========================
function renderCarrito() {
    carritoDiv.innerHTML = "";

    if (carrito.length === 0) {
        carritoDiv.innerHTML = "<p>El carrito está vacío.</p>";
        totalSpan.textContent = "0";
        return;
    }

    carrito.forEach((item) => {
        const row = document.createElement("div");
        row.className = "carrito-item";

        row.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${item.precio * item.cantidad}</span>
            <button class="btn-remove">X</button>
        `;

        row.querySelector(".btn-remove").addEventListener("click", () => {
            eliminarDelCarrito(item.id);
        });

        carritoDiv.appendChild(row);
    });

    actualizarTotal();
}

// ===========================
// ELIMINAR UN ÍTEM DEL CARRITO
// ===========================
function eliminarDelCarrito(id) {
    carrito = carrito.filter((p) => p.id !== id);
    renderCarrito();
}

// ===========================
// VACÍAR CARRITO
// ===========================
btnVaciar.addEventListener("click", () => {
    carrito = [];
    descuento = 0;
    msgCupon.textContent = "";
    renderCarrito();
});

// ===========================
// ACTUALIZAR TOTAL
// ===========================
function actualizarTotal() {
    let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    if (descuento > 0) {
        total = total - (total * descuento);
    }

    totalSpan.textContent = total.toFixed(2);
}

// ===========================
// CUPONES DE DESCUENTO
// ===========================
btnAplicarCupon.addEventListener("click", () => {
    const codigo = cuponInput.value.trim().toUpperCase();

    if (!codigo) return;

    if (codigo === "DESC10") {
        descuento = 0.10;
        msgCupon.textContent = "Cupón aplicado: 10% OFF";
        msgCupon.style.color = "green";
    } else if (codigo === "VET20") {
        descuento = 0.20;
        msgCupon.textContent = "Cupón aplicado: 20% OFF";
        msgCupon.style.color = "green";
    } else {
        descuento = 0;
        msgCupon.textContent = "Cupón inválido.";
        msgCupon.style.color = "red";
    }

    actualizarTotal();
});
