export interface CustomerRegistration {
    name: string;
    phone: string;
    email: string | null;
    dob: string | null;
    gender: 'male' | 'female' | 'other' | null;
    foodPreference: string | null;
    alcoholPreference: string | null;
    spType?: string;
}

export interface OfferHistoryEntry {
    redemptionId: number;
    code: string;
    offerTitle: string;
    status: string;
    revealedAt: string;
    redeemedAt: string | null;
}

export interface Customer extends CustomerRegistration {
    id: number;
    visitCount: number;
    registeredAt?: string;
    offerHistory?: OfferHistoryEntry[];
}
