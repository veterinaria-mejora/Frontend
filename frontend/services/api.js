/**
 * Capa de servicios API para el frontend
 * Abstrae todas las llamadas al servidor
 */
// En producción, esto debería venir de una variable de entorno del build
// Por ahora usamos una constante
const API_BASE = window.API_BASE_URL || "http://localhost:3001";
class ApiClient {
    constructor(baseUrl = API_BASE) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                credentials: "include",
            });
            // try parse JSON safely
            let data = null;
            try {
                data = await response.json();
            }
            catch (_) {
                data = null;
            }
            if (!response.ok) {
                return {
                    ok: false,
                    error: data?.error || data?.message || response.statusText || "Error en la petición",
                };
            }
            return {
                ok: true,
                data: (data && (data.data ?? data)),
            };
        }
        catch (error) {
            return {
                ok: false,
                error: error?.message || "Error de conexión",
            };
        }
    }
    // ============ AUTH ============
    async login(email, password) {
        return this.request("/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }
    async register(data) {
        return this.request("/api/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async logout() {
        return this.request("/api/logout", {
            method: "POST",
        });
    }
    async getSession() {
        return this.request("/api/session");
    }
    async forgotPassword(email) {
        return this.request("/api/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }
    async resetPassword(token, password) {
        return this.request("/api/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
    }
    // ============ PRODUCTOS ============
    async getProducts() {
        return this.request("/api/products");
    }
    async getProduct(id) {
        return this.request(`/api/products/${id}`);
    }
    // ============ CARRITO ============
    async getCart() {
        return this.request("/api/cart");
    }
    async addToCart(productId, quantity = 1) {
        return this.request("/api/cart", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
        });
    }
    async updateCartItem(productId, quantity) {
        return this.request(`/api/cart/${productId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        });
    }
    async removeFromCart(productId) {
        return this.request(`/api/cart/${productId}`, {
            method: "DELETE",
        });
    }
    async clearCart() {
        return this.request("/api/cart", {
            method: "DELETE",
        });
    }
    // ============ CUPONES ============
    async getCoupons() {
        return this.request("/api/coupons");
    }
    async validateCoupon(code) {
        return this.request("/api/coupons/validate", {
            method: "POST",
            body: JSON.stringify({ code }),
        });
    }
    async createCoupon(code) {
        return this.request("/api/coupons", {
            method: "POST",
            body: JSON.stringify({ code }),
        });
    }
    async deleteCoupon(code) {
        return this.request(`/api/coupons/${encodeURIComponent(code)}`, {
            method: "DELETE",
        });
    }
    // ============ ADOPCIONES ============
    async getPets() {
        return this.request("/api/pets");
    }
    async getPet(id) {
        return this.request(`/api/pets/${id}`);
    }
    async createPet(data) {
        return this.request("/api/pets", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async updatePet(id, data) {
        return this.request(`/api/pets/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }
    async deletePet(id) {
        return this.request(`/api/pets/${id}`, {
            method: "DELETE",
        });
    }
    // ============ APPOINTMENTS ============
    async createAppointment(data) {
        return this.request("/api/appointments", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async getAppointments() {
        return this.request("/api/appointments");
    }
    // ============ FORMULARIO ============
    async createForm(data) {
        return this.request("/api/formulario", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}
export const api = new ApiClient();
export default api;
