import { Offer } from '../types/offer';

const API_URL = import.meta.env.VITE_API_URL;

export const offerService = {
    async getAllOffers(): Promise<Offer[]> {
        try {
            const response = await fetch(`${API_URL}/Offer/GetAll`);
            if (!response.ok) return [];

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching offers:', error);
            return [];
        }
    },

    async getOfferAnalytics(id: number): Promise<Offer | null> {
        try {
            const response = await fetch(`${API_URL}/Offer/GetAll?Id=${id}`);
            if (!response.ok) return null;

            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                return result.data[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching analytics for offer ${id}:`, error);
            return null;
        }
    },

    async manageOffer(offerData: any): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const response = await fetch(`${API_URL}/Offer/ManageOffer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offerData),
            });
            if (!response.ok) return { success: false, message: 'Failed to manage offer' };

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error managing offer:', error);
            return { success: false, message: 'Network error occurred while managing offer' };
        }
    }
};
