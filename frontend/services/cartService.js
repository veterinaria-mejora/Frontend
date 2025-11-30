/**
 * Servicio de carrito del cliente
 * Maneja la lógica del carrito en el frontend
 */
import { Producto } from "../models/Producto.js";
import { Carrito } from "../models/Carrito.js";
class CartService {
    constructor() {
        this.storageKey = "vet_cart_v1";
        this.cart = new Carrito();
        this.loadFromStorage();
    }
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                // Restaurar productos del carrito
                data.items?.forEach((item) => {
                    const producto = new Producto(item.id, item.nombre, item.precio);
                    this.cart.agregarProducto(producto, item.cantidad);
                });
            }
        }
        catch (e) {
            console.warn("No se pudo cargar el carrito desde localStorage", e);
        }
    }
    saveToStorage() {
        try {
            const items = this.cart.listarProductos();
            localStorage.setItem(this.storageKey, JSON.stringify({ items }));
        }
        catch (e) {
            console.warn("No se pudo guardar el carrito en localStorage", e);
        }
    }
    agregarProducto(producto, cantidad = 1) {
        this.cart.agregarProducto(producto, cantidad);
        this.saveToStorage();
    }
    eliminarProducto(id, cantidad = 1) {
        this.cart.eliminarProducto(id, cantidad);
        this.saveToStorage();
    }
    obtenerTotal() {
        return this.cart.obtenerTotal();
    }
    listarProductos() {
        return this.cart.listarProductos();
    }
    vaciarCarrito() {
        this.cart.vaciarCarrito();
        this.saveToStorage();
    }
    obtenerCantidadTotal() {
        return this.cart.obtenerCantidadTotal();
    }
}
export const cartService = new CartService();
export default cartService;
