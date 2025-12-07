import { router } from "../router/routes.js";
export const api = axios.create({
    baseURL: "http://localhost:3001/backend",
    withCredentials: true
    
})

const service = {
    register: async () => await api.get(router.GET_PET),

    login: async (email, password) => await api.post(router.LOGIN,{email, password}),

    registerUser: async ( name, lastname, email, password) => await api.post(router.REGISTER, {name, lastname, email, password}),

    logout: async () => await api.post(router.LOGOUT),

    auth: async () => await api.get(router.AUTH_USER),

    addPet: async (nombre,tipo,raza,edad,descripcion,imagen_m) => await api.post(router.ADD_PET,{nombre,tipo,raza,edad,descripcion,imagen_m}),

    deletePet: async (id) => await api.delete(`${router.DELETE_PET}/${id}`),

    getProducts: async () => await api.get(router.SHOW_PRODUCTS),

    getCart : async () => await api.get(router.GET_CART),

    deleteItem : async (id) => await api.delete(`${router.DELETE_ITEM}/${id}`)
}

export default service