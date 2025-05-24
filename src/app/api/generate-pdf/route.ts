import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';
import { getCachedCompanyInfo } from '@/app/server/lib/cache/companyInfoCache';
import { generateHtml } from '@/app/server/lib/pdf-templates/electInspect';
import { sendDynamicPdf } from '@/app/server/services/emailService';
import { formatDateRTL } from '@/app/server/utils';
import { launchBrowser } from '@/app/server/utils/puppeteerBrowser';
import { appStrings } from '@/app/utils/AppContent';
import { User } from '@/app/utils/types/entities';
import { PdfField } from '@/app/utils/types/formTypes';
import { NextRequest, NextResponse } from 'next/server';

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

async function _handleDynamicSend(payload: any) {

    try {

        if (!payload.user) {
            console.error('user is missing!')
            return {success: false, message: 'user is missing'};
        }

        const companyInfo = await getCachedCompanyInfo(payload.user.company_id);        
        const updatedFormFields = await _addUserInfo(payload.user, payload.staticFields, companyInfo);        
        const today = formatDateRTL(new Date()).toString();
        
        const html = generateHtml({ date: today, formFields: updatedFormFields, blocks: payload.dynamicBlocks });

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
    

