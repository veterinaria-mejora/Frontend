export const router = {
    GET_PET: "/pets/",
    ADD_PET: "/pets/addPet", 
    DELETE_PET: `/pets/deletePet`,
    UPDATE_PET : `/pets/updatePet`,
//  --
    LOGIN:"/user/login",
    REGISTER:"/user/register",
    LOGOUT:"/user/logout",
    AUTH_USER: "/user/authMe",
    GET_USERS: "/user/",
    DELETE_USER: "/user/delete",    
    FORGOTED_PASSWORD:"/user/forgot-password",
    CHANGE_PASWORD:"/user/reset-password",
//  --
    SHOW_PRODUCTS: "/products/",
    ADD_PRODUCTS: "/products/addProduct",
//  --
    GET_CART:"/cart/",
    DELETE_ITEM:"/cart/delete",
    ADD_PRODUCT_TO_CART:"/cart/add",
//  --
    USE_COUPON:"/coupons/use",
    ADD_COUPON:"/coupons/add",
    GET_COUPONS: "/coupons/all",
    UPDATE_STATE_COUPON:"/coupons/desAbility",
    DELETE_COUPON:"/coupons/delete",

// --

    GET_FORMS:"/form/",
    NEW_FORM:"/form/newForm",
    UPDATE_STATE: "/form/estado",

//- 
    CONTADORES:"/contadores/"
}