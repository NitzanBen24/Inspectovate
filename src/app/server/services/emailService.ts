// app/api/email/sendEmail.ts
import { appStrings, sysStrings } from '@/app/utils/AppContent';
import { ActionResponse } from '@/app/utils/types/general';
import { EmailInfo } from '@/app/utils/types/emailTypes';
import { PdfField, PdfForm } from '@/app/utils/types/formTypes';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});


export const prepareEmail = (receiver: string, form: PdfForm, attachments: any): EmailInfo => {
    
    /** todo: add subject => now provider is subject */
    const options: EmailInfo = {};  
    const emailFields = ['customer', 'provider', 'message'];
    const emailOption: Record<string, string> = {
        'provider': 'subject',
        'customer': 'filename',
    };

    if (form.formFields) {
        form.formFields.forEach((item) => {
            if (emailFields.includes(item.name as keyof EmailInfo) && item.value) {
            const key = emailOption[item.name] as keyof EmailInfo;
            options[key] = item.value as any;
            }
        });
    }

    if(attachments.length > 0) {
        options.attachments = attachments;
    }

    if (!options['filename']) {
        options.filename = form.name;
    }

    options.receiver = receiver;
    
    // Return the final EmailInfo object 
    return options;
};

export async function sendEmail( email: EmailInfo): Promise<any> {
  
    if (!email.receiver || !email.attachments) {
        const error = sysStrings.email.failedMessage + sysStrings.email.missingInfo;
        console.error(error);
        return { success: false, message: error, error };
    }

    try {

        const attachments = email.attachments.map((item, index) => ({
            filename: `${email.filename}${(index === 0) ? '' : index}.pdf`,
            content: item,
            encoding: 'base64',
        }));

        const options = {
            from: process.env.EMAIL_USER,
            to: email.receiver,
            subject: email.subject || '',
            text: email.message || '',
            attachments,
        };
// todo: handle the await return
        await transporter.sendMail(options);        

        //LOGS
        console.info(sysStrings.email.successMessage)
        return { success: true, message: appStrings.dataSaved +' '+ appStrings.email.success };
        
    } catch (mailError) {
        console.error(sysStrings.email.failedMessage);        
        return { success: false, message: appStrings.email.failed, error: mailError };
    }
}


export async function sendDynamicPdf(pdfBuffer: Buffer, to: string, filename: string) {    
  
    try {
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: 'דו"ח בדיקה מצורף',
            text: 'מצורף קובץ הדו"ח בפורמט PDF.',
            attachments: [
                {
                    filename: `${filename}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
    
        return info;
    } catch(err) {
        console.error('error!!', err)
        return {success: false, err}
    }
  }