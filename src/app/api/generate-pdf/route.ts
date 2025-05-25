import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';
import { getCachedCompanyInfo } from '@/app/server/lib/cache/companyInfoCache';
import { generateHtml } from '@/app/server/lib/pdf-templates/electInspect';
import { sendDynamicPdf } from '@/app/server/services/emailService';
import { formatDateRTL } from '@/app/server/utils';
import { launchBrowser } from '@/app/server/utils/puppeteerBrowser';
import { appStrings } from '@/app/utils/AppContent';
import { User } from '@/app/utils/types/entities';
import { EmberBlock, PdfField } from '@/app/utils/types/formTypes';
import { NextRequest, NextResponse } from 'next/server';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

// export async function _launchBrowser() {
//     return await puppeteer.launch({
//         args: chromium.args,        
//         executablePath: await chromium.executablePath(),
//         headless: true,
//       });
// }


const _addUserInfo = async (user: User, fields: PdfField[], companyInfo: any) => {    
    
    const fieldMap: { name: keyof typeof companyInfo; value: string | undefined }[] = [
        { name: 'pname', value: companyInfo.pname },
        { name: 'plicense', value: companyInfo.plicense },
        { name: 'pphone', value: companyInfo.pphone },
        { name: 'pemail', value: companyInfo.pemail },
      ];
    
    fieldMap.forEach(({ name, value }) => {
        const field = fields.find(f => f.name === name); 
        if (field) field.value = value || '';
    });
    
    return fields;
    
}

const _getfileName = (fields: PdfField[], today: string) => {

    return (
        (fields.find(f => f.name === 'site')?.value || '') + '-' +
        (fields.find(f => f.name === 'system')?.value || '') + '-' +
        (fields.find(f => f.name === 'location')?.value || '') + '-' +
        today
    )
}


function _generateHtml({
    date, 
    formFields,
    blocks,
  }: {
    date: string;
    formFields: PdfField[];    
    blocks: EmberBlock[];
  }) {
    return `
    <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <style>
            @page { margin: 40px; }
            body { font-family: Arial, sans-serif; padding: 0; }
            
        </style>
      </head>
      <body>
        <div class="section mt-20">
                    <p class="bold-underline">לאחר בדיקת התוצאות אשר התקבלו הריני מאשר מתקן זה</p>
                    <div class="row">
                        <div class="section">
                            <span class="text-bold mb-6">בברכה</span>
                            <span class="text-bold"> ניצן</span>
                            <span class="text-bold">בודק חשמל מוסמך</span>
                            <span class="text-bold mb-6"></span>
                        </div>
                        
                    </div>
                </div>
      </body>
    </html>
    `;
  }

async function _handleDynamicSend(payload: any) {

    try {

        if (!payload.user) {
            console.error('user is missing!')
            return {success: false, message: 'user is missing'};
        }

        const companyInfo = await getCachedCompanyInfo(payload.user.company_id);        
        const updatedFormFields = await _addUserInfo(payload.user, payload.staticFields, companyInfo);        
        const today = formatDateRTL(new Date()).toString();
        
        const html = _generateHtml({ date: today, formFields: updatedFormFields, blocks: payload.dynamicBlocks });

        const browser = await launchBrowser();
          
        try {
            const page = await browser.newPage(); 
            // todo check what returns
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            const nodeBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(Uint8Array.from(pdfBuffer));
            
            const filename = _getfileName(updatedFormFields, today);     
            //todo handle response       
            const sendResult = await sendDynamicPdf(nodeBuffer, companyInfo['report_email'], filename);
            
            return { success: true, message: appStrings.email.success }
        } finally {
            await browser.close();
        }

    } catch(err: any) {
        console.error('Error: sending Dynamic file', err)
        return { success: false, message: err.message, err };
    }


}




export async function POST(req: NextRequest) {
    
    try {

        const payload = await req.json();
    
        if (!payload) {
            return NextResponse.json({ error: "Missing payload data!" }, { status: 400 });
        }

        // const result = await sendDynamicForm(payload);
        const result = await _handleDynamicSend(payload);
        
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
    

