
export interface PdfField {
    name: string;
    type: string;
    require: boolean;
    value?:string;
    options?: string[];
}

export interface PdfForm {
    name: string;
    formFields: PdfField[];
    status: string;
    id?: number;
    userId?: string;
    userName?: string;
    created_at?: any;
    images?: any;
    company_id?:number;    
    signature?: any;
}

export interface FormBlocks {
    name: string;
    fields: PdfField[];
}

export type FieldsObject = {
    [key: string]: string;// | PdfField[]; // Dynamic key-value pairs for each form input
}

export interface FormPayload {
    form: PdfForm;
    userId: string;
    userName: string;
    role: string;
    company_id: number;    
    sendMail?: boolean;
    mailAddress?: string;
    hasStorage: boolean;
    action?: string
    files?: any[];
    signature?: any;
}

export interface ListOption {
    val: string;
    id?: number;
}

// Define the valid keys for optionsMap
export type OptionKeys = 'provider' | 'electrician' | 'planner' | 'convertor' | 'panel' | 'facillity';

// Define the structure of optionsMap
export type OptionsMap = Record<OptionKeys, string[] | ListOption[]>;
