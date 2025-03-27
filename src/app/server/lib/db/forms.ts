import { FieldsObject } from "@/app/utils/types/formTypes";
import { ActionResponse } from "@/app/utils/types/general";
import { supabase } from "../supabase";
import { SearchData } from "@/app/utils/types/payloads";
import { formModel } from "@/app/utils/types/entities";
import { PostgrestError } from "@supabase/supabase-js";
import { appStrings, sysStrings } from "@/app/utils/AppContent";


const _setErrorMessage = (error: any) => {//, act: string


    if (!error.message) {
        error.message = sysStrings.database.error;
    }

    return error;
}
 
export const getActiveForms = async (): Promise<formModel[]> => {

    const { data, error } = await supabase
        .from('forms_records')
        .select('*')
        .neq('status', 'archive') // Filter: status not 'archive'
        .order("created_at", { ascending: false }); // Ensure latest data

    if (error) {
        console.error(`Error fetching forms: ${error.message}`)
        throw error;
    }

    // Remove 'user_id' from each form object
    // const filteredData = data.map((item: formModel) => {
    //     const { user_id, ...rest } = item;
    //     return rest;
    // });

    return data;
};

export const getActiveFormsByUserId = async (id: number): Promise<formModel[]> => {
    
    const { data, error } = await supabase
        .from('forms_records')
        .select('*')
        .eq('user_id', id)
        .neq('status', 'archive')
        .order("created_at", { ascending: false }); // Ensure latest data

    if (error) {
        console.error(`Error fetching forms for user ID:: ${error.message}`);
        throw error;
    }
    
    return data;
}

export const getFormById = async (id: number): Promise<formModel[]> => {
    
    const { data, error } = await supabase
      .from('forms_records')
      .select('*')
      .eq('id', id);

    if (error) {
        console.error(`Error fetching form from table forms_records:: ${error}`);      
        throw error;
    }

    return data;
};

export const addNewForm = async (payload: formModel): Promise<any> => {

    const { error, data } = await supabase.from('forms_records').insert(payload).select();

    if (error) {
        console.error('Error: failed to insert new data::', error);        
        throw new Error(error.message || sysStrings.database.error);// _setErrorMessage(error);
    }

    return data;
}

export const updateForm = async (id: string | number, payload: formModel): Promise<any> => {  
    
    const { error, data } = await supabase
        .from('forms_records')
        .update(payload)
        .eq('id', id) // Assuming `id` is the primary key column name
        .select();

    if (error) {        
        console.error('Error: failed to update form::=>',error)        
        throw _setErrorMessage(error);
    }
    
    return data;
};

export const updateFormStatus = async (payload: {id: string , status: string}): Promise<any> => {

    const { error } = await supabase
        .from('forms_records')
        .update({ status: payload.status }) // Update only the status field
        .eq("id", payload.id) // Match the record by its ID
        .select();
        
    if (error) {        
        console.error('Error: failed to update form status::',error.message)        
        throw _setErrorMessage(error); 
    }

    return { message: appStrings.form.archive, success: true };

};

export const  deleteForm = async (id:string): Promise<any> => {

    const { error } = await supabase
        .from('forms_records')
        .delete() // Delete the record
        .eq("id", id); // Match the record by its ID

    if (error) {
        console.error("Error deleting form:", error.message);
        throw _setErrorMessage(error); 
    }

    return { message: appStrings.form.delete, success: true };

}

export const getSearchForms = async (searchQuery: SearchData): Promise<any> => {
        
    let query = supabase.from('forms_records').select('*').eq('status', 'archive');
    // Add filters dynamically
    Object.entries(searchQuery).forEach(([key, value]) => {
    if (key === 'created_at') {
        // Handle date filtering for the created_at field
        query = query.gte(key, `${value}T00:00:00`).lt(key, `${value}T23:59:59`);
    } else {
        // Handle other fields
        query = query.ilike(key, `%${value}%`); // Use ilike for partial matches
    }
    });

    // Execute the query
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching: getSearchForms:', error);            
        throw _setErrorMessage(error);
    }
    
    return data;

};