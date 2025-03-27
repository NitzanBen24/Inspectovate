import { User } from "@/app/utils/types/entities";
import { supabase } from "../supabase";


export async function getUserByEmail (email : string): Promise<any> {

    const {data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email)
    .single()

    if (error) {
        console.error('Error getting user by email::')
        throw error;
    }
    
    return data;
}

export async function getRole (id: string): Promise<any> {
    
    const { data, error } = await supabase
    .from('app_users')
    .select('role')
    .eq('id',id)
    .single()

    if (error) {
        console.error('Error getting user role::', error.message);            
        throw error;
    }
    
    return data;
    
}

export async function getUserDetails (id: string): Promise<any> {

    const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id',id)
        .single()

    
    if (error) {
        console.error('Error getting user details::', error.message);            
        throw error;
    }
    
    return data;
}