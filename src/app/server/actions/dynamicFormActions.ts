import { handleDynamicSend } from "../services/dynamicFormService";

export async function sendDynamicForm(payload: any): Promise<any> {
    try {

        if (!payload) {
            return { success: false, message: 'payload missing data' };
        }
    
        return await handleDynamicSend(payload);
            
    } catch (error: any) {
        console.error("Error: could not send Dynamic form:", error);        
        return { success: false, message: error.message, error };
    }     
}