/**
 * Página de Gestión de Cupones - Lógica del cliente
 */
import { couponService } from "../services/couponService.js";
function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
const formAgregarCupon = qs("#agregarCuponForm");
const inputNuevoCupon = qs("#nuevoCupon");
const mensajeCupon = qs("#mensajeCupon");
const listaCupones = qs("#listaCupones");
async function mostrarCupones() {
    if (!listaCupones)
        return;
    listaCupones.innerHTML = "";
    const cupones = await couponService.loadCoupons();
    cupones.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = c;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", async () => {
            const result = await couponService.deleteCoupon(c);
            mensajeCupon.textContent = result.message;
            if (result.success) {
                await mostrarCupones();
            }
        });
        li.appendChild(btnEliminar);
        listaCupones.appendChild(li);
    });
}
if (formAgregarCupon && inputNuevoCupon && mensajeCupon) {
    formAgregarCupon.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nuevo = inputNuevoCupon.value.trim().toLowerCase();
        if (!nuevo) {
            mensajeCupon.textContent = "Ingresa un cupón válido.";
            return;
        }
        const result = await couponService.createCoupon(nuevo);
        mensajeCupon.textContent = result.message;
        if (result.success) {
            inputNuevoCupon.value = "";
            await mostrarCupones();
        }
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    await mostrarCupones();
});
