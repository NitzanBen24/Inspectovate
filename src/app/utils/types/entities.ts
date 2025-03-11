

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id?:number;
    company_name?: string;
    created_at?: string;
    isLoggedIn?: boolean; 
}

export interface Manufacture {
    created_at: string;
    id: number;
    name: string;
    type: string;
}

export interface Technicians {
    created_at: string;
    id: number;
    name: string;
    email: string;
    employer: string;
    license: string;
    phone: string;
    profession: string;
}