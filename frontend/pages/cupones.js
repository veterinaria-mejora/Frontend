import authGuard from "../authprovider.js"
import service from "../services/api.js"


window.addEventListener("DOMContentLoaded", async () => {
    const ok = await authGuard()
    if (!ok) return
    await renderCupon
})

const cont = document.querySelector(".couponConteiner");

async function renderCupon() {
    const res = await service.get
    const div = document.createElement("div")
    div.className = "coupon-item";
    div.innerHTML = `
        <span>${nombre} — ${porcentaje}%</span>
        <button class="delete-coupon">Eliminar</button>
    `;
    cont.appendChild(div);
}
