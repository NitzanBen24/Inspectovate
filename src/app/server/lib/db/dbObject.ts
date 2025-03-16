import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";


export const getCompanyInfo = async (company_id: number): Promise<any> => {

    try {
        const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id',company_id)
        .single()

        if (error) {
            console.error('error in getCompanyInfo:', error.message)
            throw new Error(`field to get forms: ${error.message}`)
        }

        return data;
    } catch(err) {
        console.error('Unexpected error getting company forms:', err);
        return { error: err, message: 'Can not get company forms An unexpected error occurred!' };
    }
}


/** Add Return Type => remove any!! */
export const getManufactures = async (): Promise<any[]> => {
    const { data , error } = await supabase
    .from('Manufactures')
    .select('*');

    if (error) {
        throw new Error(`Error fetching forms: ${error.message}`);
    }
    
    return data;
}

/** Add Return Type => remove any!! */
export const getTechnicians = async (): Promise<any[]> => {
    const { data , error } = await supabase
    .from('Technicians')
    .select('*');

    if (error) {
        throw new Error(`Error fetching forms: ${error.message}`);
    }    
    return data;
}
