export class Historial {
    constructor() {
        this.compras = [];
        this.contadorId = 1;
    }
    registrarCompra(productos) {
        const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        const nuevaCompra = {
            id: this.contadorId++,
            fecha: new Date(),
            productos,
            total,
        };
        this.compras.push(nuevaCompra);
        return nuevaCompra;
    }
    listarCompras() {
        return this.compras;
    }
    obtenerCompraPorId(id) {
        return this.compras.find(c => c.id === id);
    }
    obtenerTotalGastado() {
        return this.compras.reduce((acc, c) => acc + c.total, 0);
    }
}
