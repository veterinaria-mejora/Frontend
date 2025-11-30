/**
 * Servicio de cupones del cliente
 * Maneja la lógica de cupones en el frontend
 */
import { api } from "./api.js";
class CouponService {
    constructor() {
        this.appliedCoupon = null;
        this.discountPercentage = 0;
    }
    async loadCoupons() {
        const response = await api.getCoupons();
        if (response.ok && response.data) {
            return response.data;
        }
        return [];
    }
    async validateCoupon(code) {
        const response = await api.validateCoupon(code);
        if (response.ok && response.data?.valid) {
            this.appliedCoupon = code;
            this.discountPercentage = response.data.discount || 20;
            return {
                valid: true,
                message: `Cupón válido. Se aplicó un ${this.discountPercentage}% de descuento.`,
                discount: this.discountPercentage,
            };
        }
        this.appliedCoupon = null;
        this.discountPercentage = 0;
        return {
            valid: false,
            message: "Cupón inválido.",
            discount: 0,
        };
    }
    aplicarDescuento(total) {
        if (!this.appliedCoupon || this.discountPercentage === 0) {
            return total;
        }
        return total * (1 - this.discountPercentage / 100);
    }
    getAppliedCoupon() {
        return this.appliedCoupon;
    }
    clearCoupon() {
        this.appliedCoupon = null;
        this.discountPercentage = 0;
    }
    async createCoupon(code) {
        const response = await api.createCoupon(code);
        if (response.ok) {
            return { success: true, message: `Cupón "${code}" creado correctamente.` };
        }
        return { success: false, message: response.error || "No se pudo crear el cupón." };
    }
    async deleteCoupon(code) {
        const response = await api.deleteCoupon(code);
        if (response.ok) {
            return { success: true, message: `Cupón "${code}" eliminado correctamente.` };
        }
        return { success: false, message: response.error || "No se pudo eliminar el cupón." };
    }
}
export const couponService = new CouponService();
export default couponService;
