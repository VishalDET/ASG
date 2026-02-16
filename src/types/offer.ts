export interface Offer {
    id: number;
    title: string;
    description: string;
    weight: number;
    status: 'active' | 'inactive';
    redemptions: number;
    allotted: number;
    revealed: number;
    targeting: 'all' | 'new' | 'frequent' | 'inactive';
    startDate: string;
    endDate: string;
    history: { name: string; value: number }[];
    utilizations: {
        id: number;
        userName: string;
        phone: string;
        redeemedAt: string;
        status: 'redeemed' | 'expired';
    }[];
}

export const TARGETS = [
    { value: 'all', label: 'All Users' },
    { value: 'new', label: 'New Users' },
    { value: 'frequent', label: 'Frequent (10+ visits)' },
    { value: 'inactive', label: 'Inactive (30+ days)' },
] as const;
