import { Customer, CustomerRegistration } from '../types/customer';

const API_URL = import.meta.env.VITE_API_URL;

export const customerService = {
    async getCustomerByPhone(phone: string): Promise<Customer | null> {
        try {
            const response = await fetch(`${API_URL}/Customer/GetCustomers?phone=${phone}`);
            if (!response.ok) return null;

            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                return result.data[0];
            }
            return null;
        } catch (error) {
            console.error('Error fetching customer:', error);
            return null;
        }
    },

    async registerCustomer(data: CustomerRegistration): Promise<{ success: boolean; data?: Customer; message?: string }> {
        try {
            // Explicitly map and format fields to match backend requirements
            const body = {
                id: (data as any).id || 0,
                name: data.name,
                phone: data.phone,
                email: data.email,
                dob: data.dob ? new Date(data.dob).toISOString() : null,
                gender: data.gender ? data.gender.toLowerCase() : null,
                foodPreference: data.foodPreference ? data.foodPreference.toLowerCase() : null,
                alcoholPreference: data.alcoholPreference ? data.alcoholPreference.toLowerCase() : null,
                spType: (data as any).spType || 'C'
            };

            const response = await fetch(`${API_URL}/Customer/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            return {
                success: result.success,
                data: result.data,
                message: result.message
            };
        } catch (error) {
            console.error('Error registering customer:', error);
            return { success: false, message: 'Connection error' };
        }
    },

    async getAllCustomers(): Promise<Customer[]> {
        try {
            const response = await fetch(`${API_URL}/Customer/GetCustomers`);
            if (!response.ok) return [];

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching all customers:', error);
            return [];
        }
    }
};
