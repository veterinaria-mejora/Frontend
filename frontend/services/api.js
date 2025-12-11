import { router } from "../router/routes.js";
export const api = axios.create({
    baseURL: "http://localhost:3001/backend",
    withCredentials: true

})

const service = {
    register: async () => await api.get(router.GET_PET),

    login: async (email, password) => await api.post(router.LOGIN, { email, password }),

    registerUser: async (name, lastname, email, password) => await api.post(router.REGISTER, { name, lastname, email, password }),

    getUser: async () => await api.get(router.GET_USERS),

    logout: async () => await api.post(router.LOGOUT),

    auth: async () => await api.get(router.AUTH_USER),

    addPet: async (nombre, tipo, raza, edad, descripcion, imagen_m) => await api.post(router.ADD_PET, { nombre, tipo, raza, edad, descripcion, imagen_m }),

    deleteUser: async (id) => await api.delete(`${router.DELETE_USER}/${id}`),

    deletePet: async (id) => await api.delete(`${router.DELETE_PET}/${id}`),

    updatePet: async (id, nombre, tipo, raza, edad, descripcion, imagen_m, adoptable) => await api.put(`${router.UPDATE_PET}/${id}`,{ nombre, tipo, raza, edad, descripcion, imagen_m, adoptable }),

    getProducts: async () => await api.get(router.SHOW_PRODUCTS),

    addProductCart: async (productId, quantity) => await api.post(router.ADD_PRODUCT_TO_CART, { productId, quantity }),

    getCart: async () => await api.get(router.GET_CART),

    deleteItem: async (id) => await api.delete(`${router.DELETE_ITEM}/${id}`),


//  coupones -- -- -- -- --- -- -- --- -- -- -- --- -- -- -- -- -- -- -- -- -- ---- ---- -- -- -- - --- -- --- 
    useCoupon: async (coupon) => await api.patch(router.USE_COUPON,{coupon}),
    addCoupon: async ( code, discount ) => await api.post(router.ADD_COUPON,{ code, discount }),
    getCoupons: async () => await api.get(router.GET_COUPONS),

}   

export default service