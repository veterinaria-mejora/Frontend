import { router } from "../router/routes.js";
export const api = axios.create({
    baseURL: "http://localhost:3001"
})

export const service = {
    register: async () => await api.get(router.GET_PET),

    addPet: async (nombre,tipo,raza,edad,descripcion,imagen_m) => await api.post(router.ADD_PET,{nombre,tipo,raza,edad,descripcion,imagen_m}),

    deletePet: async (id) => await api.delete(`/backend/pets/deletePet/${id}`)
}
