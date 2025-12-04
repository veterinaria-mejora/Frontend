import service from "./services/api.js"

async function authContext(){
    try {
        
        const res = await service.auth()

        localStorage.setItem("data",res.data)
        
        return res.data.ok

        
    } catch (err) {
        return err.response.data.ok
    }
}

export default async function authGuard() {
    const res = await authContext()   

    if (!res) {

        window.location.href = "/frontend/vistas/login/login.html"
        return false
    }

    return true
}