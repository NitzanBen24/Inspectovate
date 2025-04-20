import { getCachedCompanyInfo } from "../lib/cache/companyInfoCache";
import { getUserDetails } from "../lib/db/users";
import { uploadImages } from "../services/storageService";
import { handleError } from "../utils";

export async function uploadToStorage (userId: string, images: File[]): Promise<{ folderName?: string, success: boolean, message?: string, error?: any}> {

    try {

        const user = await getUserDetails(userId);
        if (!user) return handleError("Failed to upload images: something wrong with user credentials..");

        const { storage_bucket: bucketName } = await getCachedCompanyInfo(user.company_id);
        if (!bucketName) return handleError("Failed to upload images: missing company info..");
        
        const { folderName, error } = await uploadImages({ images, userId, bucketName});
        if (error) return handleError("Storage was not found: path is wrong!", error);

        return { folderName, success: true }

    } catch(error: any) {
        console.error(`Something went wrong, while trying to upload::${error.message}`)
        return {success: false, message: error.message, error}
    }
    
}