const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5242/api';

export interface AdminProfile {
    id: number;
    firebaseUid: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    createdDate: string;
}

export const adminService = {
    async getAdminByEmail(email: string): Promise<{ success: boolean; data?: AdminProfile; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/Admin/GetById?Email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                return { success: false, message: `Failed to fetch admin profile: ${response.statusText}` };
            }

            const result = await response.json();

            if (result.success && result.data) {
                return { success: true, data: result.data };
            }

            return { success: false, message: result.message || 'Admin profile not found' };

        } catch (error) {
            console.error('Error fetching admin profile:', error);
            return { success: false, message: 'Network error occurred while fetching admin profile' };
        }
    },

    async getAllAdmins(): Promise<AdminProfile[]> {
        try {
            const response = await fetch(`${API_URL}/Admin/GetAll`);
            if (!response.ok) return [];

            const result = await response.json();
            return result.success && result.data ? result.data : [];
        } catch (error) {
            console.error('Error fetching all admins:', error);
            return [];
        }
    },

    async manageAdmin(adminData: any): Promise<{ success: boolean; data?: any; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/Admin/Manage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });

            if (!response.ok) {
                return { success: false, message: `Failed to manage admin: ${response.statusText}` };
            }

            const result = await response.json();

            if (result.success) {
                return { success: true, data: result.data, message: result.message };
            }

            return { success: false, message: result.message || 'Failed to manage admin' };

        } catch (error) {
            console.error('Error managing admin:', error);
            return { success: false, message: 'Network error occurred while managing admin' };
        }
    }
};
