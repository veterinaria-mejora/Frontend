
import {service} from "./services/api.js"

const tag = document.getElementById("hola")
const tag2 = document.getElementById("hola2")
const button = document.getElementById("2")
window.addEventListener("DOMContentLoaded",async (event)=>{
    const respose = await service.register()
    const data = await respose.data.formatted
    console.log(data)
    console.log(respose)
    data.forEach(element => {
        const p = document.createElement("p")
        p.innerText = element.raza
        tag.appendChild(p)
    
    });
})

button.addEventListener("click",async (Event)=>{
    const input = document.getElementById("1")
    const input1 = document.getElementById("3")
    const input2 = document.getElementById("4")
    const input3 = document.getElementById("5")
    const input4 = document.getElementById("6")
    const input5 = document.getElementById("7")
    await gaga(input.value,input1.value,input2.value,input3.value,input4.value,input5.value,)
})



async function gaga(i,ins,inp,inpu,input,inputt) {
    const response = await service.addPet(i,ins,inp,Number(inpu),input,inputt)
    console.log(response.data)
}