import { findPdfFile, getEnglishFormName, getQueryFields, isEmptyProps, validatePDFResult } from "@/app/utils/helper";
import { getPdfForms } from "../services/pdfService";
import { getUserActiveForms, saveForm, sendForm, fetchSearchForms } from "../services/formService";
import { FormPayload } from "@/app/utils/types/formTypes";
import { SearchData } from "@/app/utils/types/payloads";
import { fetchUserDetails } from "../services/userService";
import { fetchCompanyForms } from "../services/companyService";
import { mapFieldsToForms } from "../utils/formUtils";
import { archiveSentForms, deleteForm, updateFormStatus } from "../lib/db/forms";



export async function getFormsByUserId(userId : string): Promise<any> {

    try {
        
        const user = await fetchUserDetails(userId)
        
        if (!user || Object.keys(user).length === 0) {
            return { success: false, message: 'User was not found!', error: { message: "Can't find user"} };
        }

        // Get permited PDF forms
        const { forms, short_name: tbl } = await fetchCompanyForms(user.company_id);

        const formsNames = forms.map((f: any) => {
            return f.name;
        })
        
        const { forms: pdfFiles } = await getPdfForms(formsNames);                
        const activeForms = await getUserActiveForms(user, tbl)
        
        return { pdfFiles, activeForms };

    } catch (error: any) {
        console.error("Error in fetching data::", error.message);
        return { success: false, message: 'Failed to fetch user data', error };
    }

}

export async function formSubmit(payload: FormPayload): Promise<{ success?: boolean; message: string; data?:any; error?: unknown }> {
    try {
   
        if (!payload?.form) {
            return { message: "Missing form data", error: "Invalid input" };
        }
        
        if (payload.sendMail) { 
            return await sendForm(payload);                 
        } 
        return await saveForm(payload);     

    } catch (error: any) {
        console.error("Error: could not submit form:", error);        
        return { success: false, message: error.message, error };
        
    }
};

export async function searchForms(payload: any): Promise<{ success?: boolean, message?: string; data?:any; error?: unknown }>  {
    //query: SearchData
    try {

        const query = payload.search;

        if (!query || isEmptyProps(query)) {
            return { message: "Missing search fields", error: "Missing fields" };
        }
          
        const queryFields = getQueryFields(query);
        
        if (query.name) {            
            queryFields.name = getEnglishFormName(query.name);           
        } else {
            queryFields.name = 'inspection';
        }
        
        const { short_name: tbl } = await fetchCompanyForms(payload.company_id);

        const records = await fetchSearchForms(queryFields, tbl);   
        const foundForms =  mapFieldsToForms(records)

        return { success: true, data: foundForms };
    } catch (error: any) {
        console.error("Error in search forms:", { error });  
        return { success: false, message: error.message, error };
    }
    
    
}

export async function changeFormStatus(payload: any): Promise<{ success: boolean, message?: string; data?:any; error?: any }>{

    try {

        if (!payload.id || !payload.status || !payload.company_id) {
            return { success: false, message: 'Bad request, some details are missing' };
        }

        const { short_name: tbl } = await fetchCompanyForms(payload.company_id);
    
        return updateFormStatus(payload.id, payload.status, tbl); // Call your update logic here

    } catch (error: any) {
        console.error("Error in Update forms:", { error });  
        return { success: false, message: error.message, error };
    }
}

export async function removeToArchive(payload: any): Promise<{ success: boolean, message?: string; data?:any; error?: any }> {
    try {

        if (!payload.company_id) {
            return { success: false, message: 'Bad request, some details are missing' };
        }

        const { short_name: tbl } = await fetchCompanyForms(payload.company_id);
        
        return archiveSentForms(tbl)
    } catch (error: any) {
        console.error("Error in Update forms to Archive:", { error });  
        return { success: false, message: error.message, error };
    }
}

export async function removeForm(payload: any): Promise<{ success: boolean, message?: string; data?:any; error?: any }> {

    try {

        const { short_name: tbl } = await fetchCompanyForms(payload.company_id);
    
        return await deleteForm(payload.id, tbl); // Call your delete service or database function

    } catch (error: any) {
        console.error("Error in Delete forms:", { error });  
        return { success: false, message: error.message, error };
    }
    
}