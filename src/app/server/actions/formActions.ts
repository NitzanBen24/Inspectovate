import { findPdfFile, getEnglishFormName, getQueryFields, isEmptyProps, validatePDFResult } from "@/app/utils/helper";
import { getUserDetails } from "../lib/db/users";
import { getAllPDF, getPDFs } from "../services/pdfService";
import { fieldsToForm, getUserActiveForms, saveForm, sendForm } from "../services/formService";
import { FormPayload } from "@/app/utils/types/formTypes";
import { SearchData } from "@/app/utils/types/payloads";
import { getSearchForms } from "../lib/db/forms";
import { getCompanyInfo } from "../lib/db/dbObject";
import { ActionResponse } from "@/app/utils/types/general";



export async function getFormsByUserId(userId : string): Promise<any> {

    try {
        
        const user = await getUserDetails(userId)
        
        if (!user || Object.keys(user).length === 0) {
            return { success: false, message: 'User was not found!', error: { message: "Can't find user"} };
        }

        // Get permited PDF forms
        const { forms } = await getCompanyInfo(user.company_id);            
        if (forms.length === 0) {
            console.warn('Warn: user missing forms')
            return { pdfFiles: [], activeForms: [] }
        }
        
        const formsNames = forms.map((item: any) => {
            return item.name;
        })
        
        const pdfFiles = await getPDFs(formsNames);        
        
        const activeForms = await getUserActiveForms(user)
        
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
        } else {
            return await saveForm(payload); 
        }     

    } catch (error: any) {
        console.error("Error: could not submit form:", error);
        //throw error;// new Error(error.message || 'Could not submit form:');
        return { success: false, message: error.message, error };
        
    }
};

export async function searchForms(query: SearchData): Promise<{ success?: boolean, message?: string; data?:any; error?: unknown }>  {
    
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
        const foundForms =  fieldsToForm(records)

        return { data: foundForms };
    } catch (error: any) {
        console.error("Error in search forms:", { error, query });  
        return { success: false, message: error.message, error };
    }
    
    
}