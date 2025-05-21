import { User } from "./entities";
import { DynamicBlock, PdfForm } from "./formTypes";


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


export type PdfPayload = {
    date: string;
    siteName: string;
    blocks: DynamicBlock[];
  };