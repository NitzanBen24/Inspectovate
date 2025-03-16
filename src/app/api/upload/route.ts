import { uploadToStorage } from "@/app/server/actions/storageActions";
import { sysStrings } from "@/app/utils/AppContent";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
        const formData = await req.formData();
        const userId = formData.get('userId')?.toString();        
        const images: File[] = formData.getAll("image") as File[]; // Assuming multiple files input
        
        if (!userId || images.length === 0) {
            return NextResponse.json({ error: "No valid files uploaded" }, { status: 400 });
        }

        const uploadRes = await uploadToStorage(userId, images);
        
        if (!uploadRes.success) {
            return NextResponse.json({ error: uploadRes.error, message: uploadRes.error }, { status: 500 });
        }
        
        return NextResponse.json({ folderName: uploadRes.folderName });

    } catch (error) {
      console.error('Error during uploading:', error);
      return NextResponse.json({ error: 'An error occurred during uploading' }, { status: 500 });
    }

    
}

