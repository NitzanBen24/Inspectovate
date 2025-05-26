// import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';
// import { NextRequest, NextResponse } from 'next/server';


// export async function POST(req: NextRequest) {
    
//     try {

//         const payload = await req.json();
    
//         if (!payload) {
//             return NextResponse.json({ error: "Missing payload data!" }, { status: 400 });
//         }

//         const result = await sendDynamicForm(payload);        
        
//         if (!result.success) {
//             return NextResponse.json(                
//                 result,
//                 { status: 500 }
//             );
//         }
    
//         return NextResponse.json(result);

//     } catch (error: any) {
//         console.error("Unknown error in POST Dynamic Form:", error);        
//         return NextResponse.json({ message: error.message || "Unknown error occurred" }, { status: 500 });
//     }
    
// }


import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'edge'; // Use 'nodejs' if you get an error, Edge doesn't support native modules

export async function POST(req: NextRequest) {
  try {
    const html = '<html><body><h1>Hello PDF</h1></body></html>';
console.log('newPSOT!!:')
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // Fails if wrong
      headless: chromium.headless,
    });
    console.log('executablePath!!:',await chromium.executablePath())
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
