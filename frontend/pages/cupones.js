import authGuard from "../authprovider.js"
import service from "../services/api.js"


window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await renderCupon()
})

const cont = document.querySelector(".couponConteiner");

async function renderCupon() {
    try {
        const res = await service.getCoupons()
        const coupones = res.data.data
        console.log(coupones)
        coupones.forEach(coupon => {
        const div = document.createElement("div")
        div.className = "coupon-item";
        div.innerHTML = `
        <span>Nombre: "${coupon.code}" | Descuento: ${coupon.discount}% | Usable: ${coupon.active?"si":"no"}</span>
        <div class="coupon-actions">
        <button class="${coupon.active?"desactivar":"activar"}">${coupon.active?"desactivar":"activar"}</button>
        <button class="delete-coupon">Eliminar</button>
        </div>
        `
        const activateBtn = div.querySelector(".desactivar") || div.querySelector(".activar");
        activateBtn.addEventListener("click", () => {
            service.updateState(coupon.code,!coupon.active)
        });

        div.querySelector(".delete-coupon").addEventListener("click",()=>{
            console.log("gaga")
        })
        cont.appendChild(div);
    })
        
        
    } catch (error) {
        console.log(error)
    }
}
