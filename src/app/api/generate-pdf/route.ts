import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';
import { NextRequest, NextResponse } from 'next/server';

import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';


export async function POST(req: NextRequest) {

    try {

        const payload = await req.json();
    
        if (!payload) {
            return NextResponse.json({ error: "Missing payload data!" }, { status: 400 });
        }

        try {
            const executablePath = await chromium.executablePath();
            if (!executablePath) {
              return new Response('Chromium executablePath is undefined', { status: 500 });
            }
            return new Response(`Chromium executable path: ${executablePath}`, { status: 200 });
          } catch (error:any) {
            return new Response(`Error: ${error.message}`, { status: 500 });
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
}