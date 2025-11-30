export class Carrito {
    constructor() {
        this.productos = new Map();
    }
    agregarProducto(producto, cantidad = 1) {
        if (this.productos.has(producto.id)) {
            const item = this.productos.get(producto.id);
            item.cantidad += cantidad;
        }
        else {
            this.productos.set(producto.id, { producto, cantidad });
        }
    }
    eliminarProducto(id, cantidad = 1) {
        const item = this.productos.get(id);
        if (!item)
            return;
        if (item.cantidad > cantidad) {
            item.cantidad -= cantidad;
        }
        else {
            this.productos.delete(id);
        }
    }
    obtenerTotal() {
        let total = 0;
        this.productos.forEach(({ producto, cantidad }) => {
            total += producto.precio * cantidad;
        });
        return total;
    }
    listarProductos() {
        const lista = [];
        this.productos.forEach(({ producto, cantidad }) => {
            lista.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad,
            });
        });
        return lista;
    }
    vaciarCarrito() {
        this.productos.clear();
    }
    obtenerCantidadTotal() {
        let total = 0;
        this.productos.forEach(item => total += item.cantidad);
        return total;
    }
}
