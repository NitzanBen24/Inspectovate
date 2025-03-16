import { findPdfFile, getEnglishFormName, getQueryFields, isEmptyProps, validatePDFResult } from "@/app/utils/helper";
import { getRole, getUserDetails } from "../lib/db/users";
import { getAllPDF, getPDFs } from "../services/pdfService";
import { fieldsToForm, getUserActiveForms, saveForm, sendForm } from "../services/formService";
import { FormPayload } from "@/app/utils/types/formTypes";
import { SearchData } from "@/app/utils/types/payloads";
import { getSearchForms } from "../lib/db/forms";
import { getCompanyInfo } from "../lib/db/dbObject";


export async function getFormsByUserId(userId : string): Promise<any> {

    try {
        
        const user = await getUserDetails(userId)
        
        if (!user) {
            return { success: false, message: 'User role was not found!' };
        }

        // Get permited PDF forms
        const { forms, id } = await getCompanyInfo(user.id);    
        const formsNames = forms.map((item: any) => {
            return item.name;
        })
        
        // Dev
        //const pdfFiles = await getAllPDF();
        const pdfFiles = await getPDFs(formsNames);        
        
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
        const foundForms =  fieldsToForm(records)

        return { data: foundForms };
    } catch (error) {
        console.error("Error in search forms:", { error, query });  
        return { message: error instanceof Error ? error.message : "An unexpected error occurred", error };
    }
    
    
}