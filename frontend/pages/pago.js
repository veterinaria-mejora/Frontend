/**
 * Página de Pago - Lógica del cliente
 */
import { cartService } from "../services/cartService.js";
import { couponService } from "../services/couponService.js";
function qs(sel) {
    const el = document.querySelector(sel);
    if (!el)
        throw new Error(`Elemento no encontrado: ${sel}`);
    return el;
}
document.addEventListener("DOMContentLoaded", () => {
    const form = qs("#compraForm");
    const resultado = qs("#resultado");
    const cuponInput = qs("#cupon");
    // Cargar datos del carrito
    const items = cartService.listarProductos();
    const subtotal = cartService.obtenerTotal();
    const totalConDescuento = couponService.aplicarDescuento(subtotal);
    const descuento = subtotal - totalConDescuento;
    if (form && resultado) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const cupon = cuponInput?.value.trim() || "";
            let mensaje = "";
            let descuentoAplicado = 0;
            if (cupon) {
                const result = await couponService.validateCoupon(cupon);
                mensaje = result.message;
                if (result.valid) {
                    descuentoAplicado = subtotal * (result.discount / 100);
                }
            }
            else {
                mensaje = "Sin cupón";
            }
            const total = subtotal - descuentoAplicado;
            resultado.innerHTML = `
        <p>${mensaje}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Descuento: $${descuentoAplicado.toFixed(2)}</p>
        <p><strong>Total a pagar: $${total.toFixed(2)}</strong></p>
      `;
        });
    }
});
