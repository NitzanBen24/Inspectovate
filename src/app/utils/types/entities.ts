import { PdfField } from "./formTypes";


export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id:number;
    //company_name?: string;
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

export interface formModel {    
    id?: number;
    name: string;    
    fields: PdfField[];
    created_at?: string;
    status: string;
    customer:string;
    images: string;
    user_id: number;
    user_name: string;
    company_id?:number;    
}