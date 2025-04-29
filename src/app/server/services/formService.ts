import { FormPayload, PdfForm } from "@/app/utils/types/formTypes";
import { addNewForm, getActiveForms, getActiveFormsByUserId, getSearchForms, getSupervisorActiveForms, updateForm } from "../lib/db/forms";
import { appStrings } from "@/app/utils/AppContent";
import { getPdfForms, generateDocumnet } from "./pdfService";
import { downloadImages } from "./storageService";
import { prepareEmail, sendEmail } from "./emailService";
import { formModel, User } from "@/app/utils/types/entities";
import { getRole } from "../lib/db/users";
import { buildFormModel, mapFieldsToForms } from "../utils/formUtils";
import { getCachedCompanyInfo } from "../lib/cache/companyInfoCache";
import { isStorageForm } from "@/app/utils/helper";


type ServiceResult<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
  };  

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

const _generatePdfDocs = async (data: any): Promise<(Uint8Array | any)[]> => {

    const pdfForms : PdfForm[] = [data.form];     
    //check for storage form    
    if (isStorageForm(data.form.formFields)) {
        const { forms: storageForms } = await getPdfForms(['storage']);        
        storageForms[0].formFields = _addStorageForm(data.form, storageForms[0]);                                                        
        pdfForms.push(storageForms[0]);
    }

    return await Promise.all(pdfForms.map((form) => generateDocumnet(form))); 

}

const _getReceiver = async (compID: number, userID: string, formName: string) => {

    const { comp_email: compEmail, report_email: repoEmail } = await getCachedCompanyInfo(compID);
/** Refacrtor this */
    if (compID === 4) {
        
        const { role } = await getRole(userID);
        const receiver = (role === 'supervisor' && formName !== 'inspection') ? compEmail : repoEmail;
        
        return receiver;        
    }

    return repoEmail;
    
}

const _saveData = async (payload: FormPayload, fields:formModel) => {
    
    const { short_name: tbl } = await getCachedCompanyInfo(payload.company_id);

    if (!payload.form.id) {
        return await addNewForm(fields, tbl);            
    } else {   
        return await updateForm(payload.form.id, fields, tbl);        
    }
}

//todo revmoe to a type file
type FetchFunction = (userId: number, tblShort: string) => Promise<any>;

export const getUserActiveForms = async (user: User, tblShort: string): Promise<PdfForm[]> => {
    
    const roleFetchMap: Record<string, FetchFunction> = {
        admin: async (_, tbl) => getActiveForms(tbl),
        supervisor: async (id, tbl) => getSupervisorActiveForms(id, tbl),
        default: async (id, tbl) => getActiveFormsByUserId(id, tbl),
    };

    const fetchFn = roleFetchMap[user.role] || roleFetchMap.default;
    const records = await fetchFn(user.id, tblShort);
    
    return mapFieldsToForms(records);
};


export const saveForm = async (payload: FormPayload): Promise<any> => {

    try {
        
        const fields = buildFormModel(payload);
        // DB actions
        const saveResult = await _saveData(payload, fields);        
        
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
        if (payload.form.images && payload.company_id) {
            const { storage_bucket: bucketName } = await getCachedCompanyInfo(payload.company_id);
            payload.form.images = await downloadImages(payload.form.images, bucketName);                            
        }    
     
        const receiver = await _getReceiver(payload.company_id, payload.userId, payload.form.name);  
        const pdfDocs = await _generatePdfDocs(payload);   

        // If PDF was not generated, dont send an empty email
        if (pdfDocs.length === 0) {
            return { success: false, message: "Missing attachments to send!" };
        }

        const email = prepareEmail(receiver, payload.form, pdfDocs);
        
        return await sendEmail(email);            
        
    } catch(error: any) {
        console.error("Error, can't send Form::", error.message);
        return { success: false, message: "An unexpected error occurred", error };
    }

}

export const fetchSearchForms = async (queryFields: Record<string, any>, tbl: string) => {
    return await getSearchForms(queryFields, tbl);
}