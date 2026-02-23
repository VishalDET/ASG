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
    }
};
