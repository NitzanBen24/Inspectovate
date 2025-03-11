import { User } from "./entities";


export interface UploadPayload {
    files?: File[];
    images?: File[];
    [key: string]: any; // Allows additional dynamic fields
}

export interface SearchData {
    name?: string;
    customer?: string;
    user_name?: string;
    date?: string;
}