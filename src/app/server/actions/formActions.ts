import { findPdfFile, getEnglishFormName, getQueryFields, isEmptyProps, validatePDFResult } from "@/app/utils/helper";
import { getRole, getUserDetails } from "../lib/db/users";
import { getAllPDF } from "../services/pdfService";
import { getUserActiveForms, saveForm, sendForm } from "../services/formService";
import { FormPayload } from "@/app/utils/types/formTypes";
import { SearchData } from "@/app/utils/types/payloads";
import { getSearchForms } from "../lib/db/forms";
import { fieldsToForm } from "../lib/formatData";


export async function getFormsDataByUserId(userId : string): Promise<any> {

    try {
        
        //const { role } = await getRole(userId);
        const user = await getUserDetails(userId)
        if (!user) {
            return { success: false, message: 'User role was not found!' };
        }
        
        const pdfFiles = validatePDFResult(await getAllPDF());        
        //const activeForms = await getUserActiveForms(userId, role, pdfFiles);

        const activeForms = await getUserActiveForms(user)
        
        return { pdfFiles, activeForms};

    } catch (error) {
        console.error("Error in fetching data:", error);
        return { success: false, message: error };
    }

}

export async function formSubmit(payload: FormPayload): Promise<{ success?: boolean; message: string; data?:any; error?: unknown }> {
    try {
   
        if (!payload?.form) {
            return { message: "Missing form data", error: "Invalid input" };
        }
                
        if (payload.sendMail) {            
            return await sendForm(payload);                 
        } else {
            return await saveForm(payload); 
        }     

    } catch (error) {
        console.error("Error in FormSubmit:", error);
        return { success: false, message: "An unexpected error occurred", error };
    }
};

export async function searchForms(query: SearchData): Promise<{ message?: string; data?:any; error?: unknown }>  {
    
    try {

        if (!query || isEmptyProps(query)) {
            return { message: "Missing search fields", error: "Missind fields" };
        }
          
        const queryFields = getQueryFields(query);
                
        if (query.name) {            
            queryFields.name = getEnglishFormName(query.name);           
        } else {
            queryFields.name = 'inspection';
        }          
        
        const records = await getSearchForms(queryFields);

        const pdfFiles = validatePDFResult(await getAllPDF());
        const foundForms =  fieldsToForm(records, findPdfFile(pdfFiles, queryFields.name))

        return { data: foundForms };
    } catch (error) {
        console.error("Error in search forms:", { error, query });  
        return { message: error instanceof Error ? error.message : "An unexpected error occurred", error };
    }
    
    
}