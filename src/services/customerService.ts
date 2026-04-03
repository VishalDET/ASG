import { Customer, CustomerRegistration } from '../types/customer';
import { localDateToISO } from '../utils/dateUtils';

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
                dob: data.dob ? localDateToISO(data.dob) : null,
                gender: data.gender ? data.gender.toLowerCase() : null,
                foodPreference: data.foodPreference || [],
                alcoholPreference: data.alcoholPreference || [],
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

    async getAllCustomers(pageNumber: number = 1, pageSize: number = 10, gender?: string): Promise<{ data: Customer[]; totalCount: number }> {
        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: pageSize.toString()
            });
            if (gender && gender !== 'all') params.append('gender', gender.toLowerCase());

            const response = await fetch(`${API_URL}/Customer/GetCustomers?${params.toString()}`);
            if (!response.ok) return { data: [], totalCount: 0 };

            const result = await response.json();
            if (result.success && result.data) {
                return {
                    data: result.data,
                    totalCount: result.totalCount || result.totalRecords || result.data.length
                };
            }
            return { data: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching all customers:', error);
            return { data: [], totalCount: 0 };
        }
    },


    async getCustomerProfile(id: number): Promise<Customer | null> {
        try {
            const response = await fetch(`${API_URL}/Customer/GetCustomerProfile/${id}`);
            if (!response.ok) return null;

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching customer profile:', error);
            return null;
        }
    },

    async generateScratchCard(customerId: number): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
        try {
            const body = { customerId };
            const response = await fetch(`${API_URL}/Offer/GenerateScratchCard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            let result: any;
            try {
                result = await response.json();
            } catch (e) {
                return { success: false, message: 'Server returned an invalid response' };
            }

            return {
                success: result.success,
                data: result.data,
                message: result.message,
                error: result.error
            };

        } catch (error) {
            console.error('Error generating scratch card:', error);
            return { success: false, message: 'Connection error' };
        }
    }
};
