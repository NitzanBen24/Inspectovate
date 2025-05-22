import { generateHtml } from "../lib/pdf-templates/electInspect";
import { formatDateRTL } from "../utils";
import { sendDynamicPdf } from "./emailService";
import { getCachedCompanyInfo } from "../lib/cache/companyInfoCache";
import { User } from "@/app/utils/types/entities";
import { PdfField } from "@/app/utils/types/formTypes";
import { appStrings } from "@/app/utils/AppContent";
import { launchBrowser } from "../utils/launchBrowser";

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

    return fields.find(field => field.name === 'site')?.value || '' + '-' + 
            fields.find(field => field.name === 'system')?.value || '' + '-' +
            fields.find(field => field.name === 'location')?.value || '' + '-' +
            today;
}


export async function handleDynamicSend(payload: any) {

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