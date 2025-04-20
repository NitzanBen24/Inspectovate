import { formModel } from "@/app/utils/types/entities"
import { FieldsObject, FormPayload, PdfForm } from "@/app/utils/types/formTypes"
import sanitizeHtml from 'sanitize-html';
import { sanitizeFormModel } from "./sanitizer";


export const buildFormModel = (payload: FormPayload): formModel => {

    const customer = payload.form.formFields.find((field) => field.name === 'customer')?.value || "";     
    const queryFields: formModel = {
        name: payload.form.name,
        fields: payload.form.formFields,
        customer: customer,
        user_id: Number(payload.userId),
        user_name: payload.userName,        
        images: payload.form.images,
        company_id: payload.company_id || -1,        
        status: payload.form.status,
    }

    return sanitizeFormModel(queryFields)
}


export const mapFieldsToForms = (fields: any[]): PdfForm[] => {
    return fields.map((record) => {     
        return {
            id: record.id,
            name: record.name,
            formFields: record.fields,
            customer: record.customer,
            status: record.status,            
            userId: record.user_id.toString(),
            userName: record.user_name,
            company_id: Number(record.company_id),            
            images: record.images,
            created_at: record.created_at,
        }
    });
}
