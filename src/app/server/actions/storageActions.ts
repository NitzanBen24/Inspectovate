import { getCompanyInfo } from "../lib/db/dbObject";
import { getUserDetails } from "../lib/db/users";
import { uploadImages } from "../services/storageService";
import { handleError } from "../utils";

export const uploadToStorage = async (userId: string, images: File[]): Promise<{ folderName?: string, success: boolean, error?: unknown}> => {

    const user = await getUserDetails(userId);
    if (!user) return handleError("Failed to upload images: User doesn't exist!");

    const { storage_bucket: bucketName } = await getCompanyInfo(user.company_id);
    if (!bucketName) return handleError("Failed to upload images: Company doesn't exist!!");
    
    /** todo: check why return await uploadImages {"error":{},"message":{}} continue=>*/
    //return await uploadImages({ images, userId, bucketName});
    const { folderName, error } = await uploadImages({ images, userId, bucketName});
    
    if (error) return handleError("Storage was not found: path is wrong!");

    return { folderName, success: true }
    
}