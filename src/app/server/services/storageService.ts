import { supabase } from "../lib/supabase";

export const uploadImages = async (payload: any): 
    Promise<{ folderName?: string, success: boolean, error?: unknown }> => {

        if (!payload.userId) {        
            return { success: false, folderName: 'none' };
        }
        //payload.bucketName = 'xxx';
        let folderName = `${Date.now()}-user-` + payload.userId;
        try {
            for (let img of payload.images) {                            
                const imgName = `${folderName}/${Date.now()}-${img.name}`;            
                const { error } = await supabase.storage.from(payload.bucketName).upload(imgName, img);                                
                if (error) throw new Error(error.message);                
            }

            return { folderName, success: true };
        } catch(err) {
            console.error('Error uploading image/s to storage!!', err)
            return { success: false, error: err };
        }

}

export const downloadImages = async (folderName: string): Promise<any[]> => {    

    try {
        const { data: images, error: errorList } = await supabase.storage.from('dev-test').list(folderName)        
        
        // todo Handle error
        if (!images || errorList) {
            console.error('Error laoding files list')
            return [];
        }

        const downloadPromises = images.map(img => {            
            return supabase.storage.from('dev-test').download(`${folderName}/${img.name}`)
        }); 

        return await Promise.all(downloadPromises);
    
    } catch(err) {
        console.error('Error downloding file/s', err)
        return [] ;
    }    
}