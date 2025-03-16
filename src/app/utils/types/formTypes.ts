
export interface FormField {
    name: string;
    type: string;
    require: boolean;
    value?:string;
}

export interface PdfForm {
    name: string;
    formFields: FormField[];
    status: string;
    id?: string;
    userId?: string;
    userName?: string;
    created?: any;
    images?: any;
    company_id?:number;
    company_name?: string;
    signature?: any;
}

export type FieldsObject = {
    [key: string]: string; // Dynamic key-value pairs for each form input
}

export interface FormPayload {
    form: PdfForm;
    userId: string;
    userName: string;
    role: string;
    company_id?: number;
    company_name?: string;
    sendMail?: boolean;
    hasStorage: boolean;
    action?: string
    files?: any[];
    signature?: any;
}

export interface ListOption {
    val: string;
    id?: number;
}