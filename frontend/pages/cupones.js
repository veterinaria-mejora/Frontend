import service from "../services/api.js";
import authGuard from "../authprovider.js";

// Elementos del DOM
const form = document.getElementById("agregarCuponForm");
const inputCode = document.getElementById("nuevoCupon");
const inputDiscount = document.getElementById("descuento");
const mensajeCupon = document.getElementById("mensajeCupon");
const listaCupones = document.getElementById("listaCupones");



window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await cargarCupones()
})

// ==========================
// Cargar cupones
// ==========================
async function cargarCupones() {
    try {
        const response = await service.getCoupons();

        if (!response.data.ok) {
            listaCupones.innerHTML = "<li>Error al cargar cupones</li>";
            return;
        }


      const cupones = response.data.data;
    


         listaCupones.innerHTML = "";

        cupones.forEach(c => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${c.code}</strong> - ${c.discount}% de descuento
            `;
            listaCupones.appendChild(li);
        });

    } catch (e) {
        console.error("Error cargando cupones:", e);
        listaCupones.innerHTML = "<li>No se pudieron cargar cupones</li>";
    }
}


// ==========================
// Crear cupón
// ==========================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const code = inputCode.value.trim();
    const discount = Number(inputDiscount.value);

    try {
        const response = await service.addCoupon(code, discount);

        if (response.data.ok) {
            mensajeCupon.style.color = "green";
            mensajeCupon.textContent = "Cupón creado correctamente";

            form.reset();
            cargarCupones();
        } else {
            mensajeCupon.style.color = "red";
            mensajeCupon.textContent = response.data.error || "Error al crear cupón";
        }
    } catch (e) {
        console.log("Error al crear cupón:", e);

        mensajeCupon.style.color = "red";
        mensajeCupon.textContent = "El cupón ya existe o hubo un error";
    }
});


// ==========================
// Inicializar página
// ==========================
cargarCupones();
