const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5242/api';

export interface ValidationData {
    isValid: boolean;
    customerName: string;
    customerNumber?: string;
    offerTitle: string;
    status: string;
    revealedAt: string;
    expiryDate: string;
    offerEndDate?: string;
    message?: string;
    code?: string;
    customerId?: number;
    offerId?: string | number;
}

export interface RedeemRequest {
    code: string;
    customerId: number;
    offerId: number;
    spType: string;
}

export const redemptionService = {
    async validateCoupon(code: string): Promise<{ success: boolean; data?: ValidationData; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/Redemption/Validate/${encodeURIComponent(code)}`);
            if (!response.ok) {
                return { success: false, message: `Validation failed: ${response.statusText}` };
            }

            const result = await response.json();

            // Return data if available, even if success is false 
            // (e.g. for "Already Redeemed" status with details)
            if (result.data) {
                return {
                    success: result.success,
                    data: result.data,
                    message: result.message || result.data.message
                };
            }

            return { success: false, message: result.message || 'Invalid code' };
        } catch (error) {
            console.error('Error validating coupon:', error);
            return { success: false, message: 'Network error during validation' };
        }
    },

    async redeemCoupon(data: RedeemRequest): Promise<{ success: boolean; message?: string; data?: any }> {
        try {
            const response = await fetch(`${API_URL}/Redemption/Redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return { success: false, message: `Redemption failed: ${response.statusText}` };
            }

            const result = await response.json();
            return {
                success: result.success,
                message: result.message,
                data: result.data
            };
        } catch (error) {
            console.error('Error redeeming coupon:', error);
            return { success: false, message: 'Network error during redemption' };
        }
    }
};
