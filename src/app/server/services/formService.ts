import { FieldsObject, FormField, FormPayload, PdfForm } from "@/app/utils/types/formTypes";
import { addNewForm, getActiveForms, getActiveFormsByUserId, getFormById, updateForm } from "../lib/db/forms";
import { formToFields, sanitizeFields } from "../lib/formatData";
import { ActionResponse } from "@/app/utils/types/apiTypes";
import { appStrings } from "@/app/utils/AppContent";
import { EmailInfo } from "@/app/utils/types/emailTypes";
import { getPDFs, preparePdf } from "./pdfService";
import { downloadImages } from "./storageService";
import { prepareEmail, sendEmail } from "./emailService";
import { User } from "@/app/utils/types/entities";

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

// function _getExcludedFields(formName: string): string[] {
//     if (formName === "inspection") {
//         return ["ephone", "eemail", "elicense", "pphone", "pemail", "plicense"];
//     }
//     return [];
// }

// const _dataToFields = (data: FormPayload) => {    
//     const excludedFields = _getExcludedFields(data.form.name);
//     // Prepare data to DB
//     const fields: FieldsObject = formToFields(
//         {
//             form: data.form,
//             storage: data.form.images || '',
//             userId: data.userId,
//             userName: data.userName,
//             status: data.form.status,
//         },
//         excludedFields,
//     );

//     return sanitizeFields(fields); 
// }

const _prepareFields = (payload: FormPayload): FieldsObject => {
    const queryFields: FieldsObject = {
        name: payload.form.name,
        fields:JSON.stringify(payload.form.formFields),
        user_id:payload.userId,
        user_name: payload.userName,        
        storage: payload.form.images,
        company_id: payload.company_id?.toString() || '-1',
        company_name: payload.company_name || "company_name",
        status: payload.form.status,
    }
    
    return queryFields;
}

async function _saveData (form: PdfForm, fields:FieldsObject) {
    if (!form.id) {
        return await addNewForm(fields);            
    } else {        
        const existingForm = await getFormById(form.id);
        if (existingForm.error) {
            return await addNewForm(fields);
        } else {
            return await updateForm(form.id, fields);
        }
    }
}

/** todo: Refactor => theres a lot of await, await in await | await in a map loop */
async function _prepareToSend (data: any): Promise<EmailInfo> {

    const pdfForms : PdfForm[] = [data.form];     
    //check for storage form
    if (data.hasStorageForm.current) {                
        const storageForms = await getPDFs(['storage']);                   
        storageForms[0].formFields = _addStorageForm(data.form, storageForms[0]);                                                        
        pdfForms.push(storageForms[0]);          
    }           

    // Prepare PDF documents concurrently
    const pdfDocs = await Promise.all(pdfForms.map((form) => preparePdf(form)));    
    const email = prepareEmail(pdfForms[0].formFields, data.role, pdfForms[0].name);
    email.attachments = pdfDocs;
    
    return email;
}

export const getUserActiveForms = async (user: User): Promise<PdfForm[]> => {

    const activeFormsRecords = (user.role === 'admin') ? await getActiveForms() : await getActiveFormsByUserId(user.id.toString());

    return activeFormsRecords.map((record) => {
        // const formFields = JSON.parse(record.fields).map((field: FormField) => { 
        //     field.name.endsWith('-ls');
        // });
        console.log('check!!',JSON.parse(record.fields))
        return {
            id: record.id,
            name: record.name,
            formFields: JSON.parse(record.fields),
            status: record.status,            
            userId: record.user_id.toString(),
            userName: record.user_name,
            company_id: Number(record.company_id),
            company_name: record.company_name,
            images: record.storage,
            created: record.created_at,
        }
    });
}

export const saveForm = async (payload: FormPayload): Promise<ActionResponse> => {

    try {
    
        const fields = _prepareFields(payload)
        console.log('fields!!', fields)
        // DB actions
        const dbResult = await _saveData(payload.form, fields);    
                        
        if (dbResult?.error) {
            throw new Error(`Error, Failed save Form: ${dbResult.error}`);            
        }
    
        return { success: true, message: appStrings.dataSaved }

    } catch(error) {
        console.error("Error, can not save Form!", error);
        return { success: false, message: "An unexpected error occurred, can't save form", error };
    }
    
}

export const sendForm = async (payload: FormPayload) => {

    try {        
        
        if (payload.form.images) {            
            payload.form.images = await downloadImages(payload.form.images);            
        }
        
        const email = await _prepareToSend(payload);
        
        return await sendEmail({ email });            
        
    } catch(error) {
        console.error("Error, can not send Form!", error);
        return { message: "An unexpected error occurred", error };
    }

}