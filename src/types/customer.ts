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

export interface Customer extends CustomerRegistration {
    id: number;
    visitCount: number;
    registeredAt?: string;
}
