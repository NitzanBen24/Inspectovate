import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { generateHtml } from '@/app/server/lib/pdf-templates/electInspect';
import path from 'path';
import fs from 'fs/promises';
import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';

export async function POST(req: NextRequest) {
    
    try {

        const payload = await req.json();    
    
        if (!payload) {
            return NextResponse.json({ error: "Missing payload data!" }, { status: 400 });
        }
    
        const result = await sendDynamicForm(payload);
        
        if (!result.success) {
            return NextResponse.json(                
                result,
                { status: 500 }
            );
        }
    
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Unknown error in POST Dynamic Form:", error);        
        return NextResponse.json({ message: error.message || "Unknown error occurred" }, { status: 500 });
    }


    /** todo send pdf file via mail */

    // const savePath = path.join(process.cwd(), 'public', 'reports', `report-${Date.now()}.pdf`);

    // // Ensure the directory exists
    // await fs.mkdir(path.dirname(savePath), { recursive: true });
  
    // // Write the PDF file to disk
    // await fs.writeFile(savePath, pdfBuffer);
  
    // // Respond with the public URL to the saved PDF
    // // (Assuming `public` folder is served at root `/`)
    // const publicUrl = savePath.replace(path.join(process.cwd(), 'public'), '');
  

    //return NextResponse.json({ success: true });
    
}


    


  // Save PDF to server
  // You can customize the file path and name here:

    

