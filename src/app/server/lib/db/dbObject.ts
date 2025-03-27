import { supabase } from "../supabase";


export const getCompanyInfo = async (company_id: number): Promise<any> => {

    
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id',company_id)
        .single()

    if (error) {
        console.error('error in getCompanyInfo:', error.message)
        throw error;
    }
    
    return data;
    
}


/** Add Return Type => remove any!! */
export const getManufactures = async (): Promise<any[]> => {
    const { data , error } = await supabase
    .from('Manufactures')
    .select('*');

    if (error) {
        console.error('Manufactures was not found!')
        throw error
    }
    
    return data;
}

/** Add Return Type => remove any!! */
export const getTechnicians = async (): Promise<any[]> => {
    const { data , error } = await supabase
    .from('Technicians')
    .select('*');

    if (error) {
        console.error('Technicians was not found!')
        throw error
    }    
    return data;
}
