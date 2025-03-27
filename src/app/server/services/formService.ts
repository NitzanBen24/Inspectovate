import { FieldsObject, PdfField, FormPayload, PdfForm } from "@/app/utils/types/formTypes";
import { addNewForm, getActiveForms, getActiveFormsByUserId, getFormById, updateForm } from "../lib/db/forms";
import { ActionResponse } from "@/app/utils/types/general";
import { appStrings } from "@/app/utils/AppContent";
import { EmailInfo } from "@/app/utils/types/emailTypes";
import { getPDFs, preparePdf } from "./pdfService";
import { downloadImages } from "./storageService";
import { prepareEmail, sendEmail } from "./emailService";
import { formModel, User } from "@/app/utils/types/entities";
import { sanitizeFields } from "../utils";
import { getCompanyInfo } from "../lib/db/dbObject";
import { isStorageForm } from "@/app/client/helpers/formHelper";
import { error } from "console";

/**
 * Refactor: this use is for tcelcric, might not needed for new customers
 */
function _addStorageForm(inspection: PdfForm, storage: PdfForm) {

    if (!inspection?.formFields?.length || !storage?.formFields?.length) {
        throw new Error("Invalid input: inspection or storage form fields are missing.");
    }

    // Create a lookup map for quick access to inspection values
    const inspectionLookup = Object.fromEntries(
        inspection.formFields.map((item) => [item.name.replace("-ls", ""), item.value])
    );
    
    // Extract batteries and capacity values only once
    const batteriesValue = parseFloat(
        inspection.formFields.find((field) => field.name === "batteries")?.value || "1"
    );
    const capacityValue = parseFloat(inspectionLookup["capacity"] || "0");
    
    // Pre-fetch bmanufacture and convertor values
    const bmanufactureValue = inspectionLookup["bmanufacture"] || "";
    const convertorValue = inspectionLookup["convertor"] || "";

    // Map storage fields with optimized logic
    const updatedSmallArray = storage.formFields.map((field) => {
        switch (field.name) {
            case "bmanufacture":
            case "convertor":
                return {
                    ...field,
                    value: bmanufactureValue || convertorValue || field.value,
                };
            case "capacity":
                return {
                    ...field,
                    value: `${(capacityValue * batteriesValue).toFixed(2)} KW`,
                };
            case "cpower":
                return {
                    ...field,
                    value: `${inspectionLookup[field.name] || field.value} KW`,
                };
            default:
                return {
                    ...field,
                    value: inspectionLookup[field.name] || field.value,
                };
        }
    });

    return updatedSmallArray;
}

const _hasStorageForm = (formFields: PdfField[]) => {
    return formFields.some(field => {
        return (
            (field.name === "batteries" || field.name === "capacity") &&
            field.value !== null &&
            field.value !== undefined &&
            field.value !== ""
        );
    });
}

const _prepareFields = (payload: FormPayload): formModel => {

    const customer = payload.form.formFields.find((field) => field.name === 'customer')?.value || ""    
     /** todo: consider move to seperate file  */
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
    /** todo: sanitize form fields */
    return queryFields//sanitizeFields(queryFields);
}

async function _saveData (form: PdfForm, fields:formModel) {

    if (!form.id) {
        return await addNewForm(fields);            
    } else {   
        return await updateForm(form.id, fields);        
    }
}

async function _generatePDF (data: any): Promise<(Uint8Array | { error: any })[]> {

    const pdfForms : PdfForm[] = [data.form];     
    //check for storage form
    if (isStorageForm(data.form.formFields)) {
        const storageForms = await getPDFs(['storage']);  
        if (!('error' in storageForms)) {
            storageForms[0].formFields = _addStorageForm(data.form, storageForms[0]);                                                        
            pdfForms.push(storageForms[0]);          
        }
    }
    
    const pdfDocs = await Promise.all(pdfForms.map((form) => preparePdf(form))); 
           
    // Check if one or more of the PDF wasn't generated
    if (pdfDocs.some(doc => !(doc instanceof Uint8Array))) {// || pdfDocs.length === 0
        throw { message: 'Somthing went wrong preparing PDF file' };
    }

    return pdfDocs;

}
/** consider a change function name */
export const fieldsToForm = (fields: any[]): PdfForm[] => {
    return fields.map((record) => {     
        return {
            id: record.id,
            name: record.name,
            formFields: record.fields,//JSON.parse(record.fields),
            customer: record.customer,
            status: record.status,            
            userId: record.user_id.toString(),
            userName: record.user_name,
            company_id: Number(record.company_id),
            //company_name: record.company_name,
            images: record.images,
            created_at: record.created_at,
        }
    });
}

export const getUserActiveForms = async (user: User): Promise<PdfForm[]> => {
    const records = (user.role === 'admin') ? await getActiveForms() : await getActiveFormsByUserId(user.id);
    return fieldsToForm(records);
}

export const saveForm = async (payload: FormPayload): Promise<any> => {

    try {
    
        const fields = _prepareFields(payload)
        // DB actions
        const saveResult = await _saveData(payload.form, fields);        
        
        if (!saveResult.length) {        
            return { success: false, message: appStrings.actionFailed +' '+ appStrings.saveFailed }
        }
    
        return { success: true, message: appStrings.dataSaved }

    } catch(error: any) {
        console.error("Error: failed to save Form::", error.message);        
        return { success: false, message: error.message, error };
   
    }
    
}

export const sendForm = async (payload: FormPayload) => {

    try {        

        // Download images from company storage
        if (payload.form.images) {           
            if(payload.company_id) {
                const { storage_bucket: bucketName } = await getCompanyInfo(payload.company_id);            
                payload.form.images = await downloadImages(payload.form.images, bucketName);                
            } else {
                payload.form.images = '';
            }
        }    

        const pdfDocs = await _generatePDF(payload);

        const email = prepareEmail(payload.form.formFields, pdfDocs, payload.role, payload.form.name);
        
        return await sendEmail(email);            
        
    } catch(error: any) {
        console.error("Error, can't send Form::", error.message);
        return { success: false, message: "An unexpected error occurred", error };
    }

}