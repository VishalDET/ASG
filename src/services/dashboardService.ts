const API_URL = import.meta.env.VITE_API_URL;

export interface EngagementPoint {
    date: string;
    value: number;
}

export interface RedemptionPoint {
    date: string;
    reveals: number;
    redemptions: number;
}

export interface DashboardMetrics {
    totalCustomers: number;
    activeOffers: number;
    totalRedemptions: number;
    pendingRedemptions: number;
    engagementChart: EngagementPoint[];
    redemptionChart: RedemptionPoint[];
}

export const dashboardService = {
    async getDashboardMetrics(days: number = 7): Promise<DashboardMetrics | null> {
        try {
            const response = await fetch(`${API_URL}/Dashboard/GetMetrics?days=${days}`);
            if (!response.ok) return null;

            const result = await response.json();
            if (result.success && result.data) {
                return result.data as DashboardMetrics;
            }
            return null;
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            return null;
        }
    }
};
