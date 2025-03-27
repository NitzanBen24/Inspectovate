import { supabase } from "../lib/supabase";

export const uploadImages = async (payload: any): 
    Promise<{ folderName?: string, success: boolean, error?: any }> => {

        if (!payload.userId) {
            console.error('User id is missing, unable to upload images::')
            return { success: false, folderName: 'none', error:{ message: 'something went wrong, unable to upload images to storage..' } };
        }
        
        let folderName = `${Date.now()}-user-` + payload.userId;
        try {
            for (let img of payload.images) {                            
                const imgName = `${folderName}/${Date.now()}-${img.name}`;            
                const { error } = await supabase.storage.from(payload.bucketName).upload(imgName, img);                                
                if (error) throw error;//new Error(error.message);                
            }

            return { folderName, success: true };
        } catch(error: any) {
            console.error('Error uploading image/s to storage!!', error.message)
            return { success: false, error };
        }

}

export const downloadImages = async (folderName: string, bucketName: string): Promise<any[]> => {    

    try {
        
        const { data: images, error: supabaseErr } = await supabase.storage.from(bucketName).list(folderName)        
        
        if (!images || supabaseErr) {
            console.error('Error: laoding files list')
            return [];
        }

        const downloadPromises = images.map(img => {            
            return supabase.storage.from(bucketName).download(`${folderName}/${img.name}`)
        }); 

        return await Promise.all(downloadPromises);
    
    } catch(error: any) {
        console.error('Error downloding file/s', error.message)
        return [];
    }    
}