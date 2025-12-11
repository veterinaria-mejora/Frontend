import authGuard from "../authprovider.js"
import service from "../services/api.js"


window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    console.log(ok)
    if (!ok) return
    await renderCupon()
})

const cont = document.querySelector(".couponConteiner");
const bttForm = document.getElementById("agregarCuponForm")

bttForm.addEventListener("submit",async(e)=>{
    e.preventDefault()
    await addNewCoupons()
})

async function addNewCoupons() {
    try {
        const nuevoCupon = document.getElementById("nuevoCupon").value.trim();
        const value = document.getElementById("required").value.trim();
        console.log("asljkdaksdj")
        await service.addCoupon(nuevoCupon,value)
        cont.innerHTML = ""           
        await renderCupon()
        document.getElementById("nuevoCupon").value = ""
        document.getElementById("required").value = ""
    } catch (error) {
        
    }
}

async function renderCupon() {
    try {
        const res = await service.getCoupons()
        const coupones = res.data.data
        console.log(coupones)
        coupones.forEach(coupon => {
        const div = document.createElement("div")
        div.className = "coupon-item";
        div.innerHTML = `
        <span class="usable">Nombre: "${coupon.code}" | Descuento: ${coupon.discount}% | Usable: ${coupon.active?"si":"no"}</span>
        <div class="coupon-actions">
        <button class="${coupon.active?"desactivar":"activar"}">${coupon.active?"desactivar":"activar"}</button>
        <button class="delete-coupon">Eliminar</button>
        </div> 
        `
        const activateBtn = div.querySelector(".desactivar") || div.querySelector(".activar");
        activateBtn.addEventListener("click", async() => {
            console.log(!coupon.active)

            await service.updateStateCoupon(coupon.code,coupon.active)
            coupon.active = !coupon.active
            activateBtn.textContent = coupon.active ? "desactivar" : "activar";
            activateBtn.classList.remove("activar", "desactivar");
            activateBtn.classList.add(coupon.active ? "desactivar" : "activar");
            div.querySelector(".usable").textContent=`Nombre: "${coupon.code}" | Descuento: ${coupon.discount}% | Usable: ${coupon.active?"si":"no"}`
        });

        div.querySelector(".delete-coupon").addEventListener("click",async()=>{
            try {
                await service.deleteCoupon(coupon.code)
                div.remove()
                
            } catch (error) {
                
            }
        })
        cont.appendChild(div);
    })
        
        
    } catch (error) {
        console.log(error)
    }
}
