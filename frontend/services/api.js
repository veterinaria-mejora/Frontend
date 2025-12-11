import { router } from "../router/routes.js";
export const api = axios.create({
    baseURL: "http://localhost:3001/backend",
    withCredentials: true

})

const service = {
    register: async () => await api.get(router.GET_PET),//CAMBIAR URGENTEMENTE

    login: async (email, password) => await api.post(router.LOGIN, { email, password }),

    registerUser: async (name, lastname, email, password) => await api.post(router.REGISTER, { name, lastname, email, password }),

    getUser: async () => await api.get(router.GET_USERS),

    logout: async () => await api.post(router.LOGOUT),

    auth: async () => await api.get(router.AUTH_USER),

    addPet: async (nombre, tipo, raza, edad, descripcion, imagen_m) => await api.post(router.ADD_PET, { nombre, tipo, raza, edad, descripcion, imagen_m }),

    deleteUser: async (id) => await api.delete(`${router.DELETE_USER}/${id}`),

    deletePet: async (id) => await api.delete(`${router.DELETE_PET}/${id}`),

    updatePet: async (id, nombre, tipo, raza, edad, descripcion, imagen_m, adoptable) => await api.put(`${router.UPDATE_PET}/${id}`,{ nombre, tipo, raza, edad, descripcion, imagen_m, adoptable }),

    forgotedPass: async (email) =>await api.post(router.FORGOTED_PASSWORD,{email}),

    changePass: async (token,password)=>api.post(router.CHANGE_PASWORD,{token,password}),
    
    //PRODUCTOS -- -- --- -- ----------- --------------------------------------------------- -- --- ----- --- --- ----- - -  - -  -- -- - - - - -  --   --  --

    getProducts: async () => await api.get(router.SHOW_PRODUCTS),
    
    addProduct: async (nombre, precio, stock, url_imagen)=> await api.post(router.ADD_PRODUCTS,{nombre, precio, stock, url_imagen}),

    addProductCart: async (productId, quantity) => await api.post(router.ADD_PRODUCT_TO_CART, { productId, quantity }),

    getCart: async () => await api.get(router.GET_CART),

    deleteItem: async (id) => await api.delete(`${router.DELETE_ITEM}/${id}`),


    //  coupones -- -- -- -- --- -- -- --- -- -- -- --- -- -- -- -- -- -- -- -- -- ---- ---- -- -- -- - --- -- --- 
    useCoupon: async (coupon) => await api.patch(router.USE_COUPON, { coupon }),
    addCoupon: async (code, discount) => await api.post(router.ADD_COUPON, { code, discount }),
    getCoupons: async () => await api.get(router.GET_COUPONS),
    updateStateCoupon: async (code,state) => await api.patch(router.UPDATE_STATE_COUPON,{code,state}),
    deleteCoupon: async (code) =>await api.delete(`${router.DELETE_COUPON}/${code}`),
    //  formulario -- -- -- -- --- -- -- --- -- -- -- --- -- -- -- -- -- -- -- -- -- ---- ---- -- -- -- - --- -- --- 

    getForm: async () => await api.get(router.GET_FORMS),
    addForm: async (
        nombre,
        apellido,
        telefono,
        mail,
        fecha_nacimiento,
        direccion,
        ciudad,
        provincia,
        codigo_postal,
        pais,
        tipo_documento,
        numero_documento,
        tipo_vivienda,
        espacio_seguro,
        tiempo_solo,
        personas_encasa,
        familia_deacuerdo,
        otras_mascotas_anteriormente,
        tipo,
        otras_mascotas_actualmente,
        tipo_mascotas_actual,
        eventos,
        recursos,
        vacunar_y_esterilizar,
        encargado_cuidado,
        sitio_animal_solo,
        rol_del_animal,
        estado
    ) =>
        await api.post(router.NEW_FORM, {
            nombre,
            apellido,
            telefono,
            mail,
            fecha_nacimiento,
            direccion,
            ciudad,
            provincia,
            codigo_postal,
            pais,
            tipo_documento,
            numero_documento,
            tipo_vivienda,
            espacio_seguro,
            tiempo_solo,
            personas_encasa,
            familia_deacuerdo,
            otras_mascotas_anteriormente,
            tipo,
            otras_mascotas_actualmente,
            tipo_mascotas_actual,
            eventos,
            recursos,
            vacunar_y_esterilizar,
            encargado_cuidado,
            sitio_animal_solo,
            rol_del_animal,
            estado,
        }),

    updateFormState: async (idformulario, estado) =>
        await api.put(`${router.UPDATE_STATE}/${idformulario}`, { estado }),



}

export default service