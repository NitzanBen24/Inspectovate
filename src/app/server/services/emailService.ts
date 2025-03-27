// app/api/email/sendEmail.ts
import { appStrings, sysStrings } from '@/app/utils/AppContent';
import { ActionResponse } from '@/app/utils/types/general';
import { EmailInfo } from '@/app/utils/types/emailTypes';
import { PdfField } from '@/app/utils/types/formTypes';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// interface MailOptions {
//   email: EmailInfo;  
// }

export const prepareEmail = (formFields: PdfField[], attachments: any, role: string, formName: string): EmailInfo => {
    
    const options: EmailInfo = {};  
    const emailFields = ['customer', 'provider', 'message', 'reciver'];

    formFields.forEach((item) => {
        if (emailFields.includes(item.name as keyof EmailInfo) && item.value) {
        const key = item.name as keyof EmailInfo;
        options[key] = item.value as any;
        }
    });

    if(attachments.length > 0) {
        options.attachments = attachments;
    }

    // // Alpha version => Testing  
    // options.reciver = (role === 'admin' || formName === 'inspection') ? 'hazanreport@gmail.com' : 'tcelctric@gmail.com';
    // const reciverField = formFields.find((item) => item.name === 'reciver');
    // if (reciverField) {    
    //   options.reciver = 'nitzanben24@gmail.com';
    // }

    options.reciver = 'nitzanben24@gmail.com';
    
    // Return the final EmailInfo object 
    return options;
};

export async function sendEmail( email: EmailInfo): Promise<any> {
  
    if (!email.reciver || !email.customer || !email.attachments) {
        const error = sysStrings.email.failedMessage + sysStrings.email.missingInfo;
        console.error(error);
        return { success: false, message: error, error };
    }


    try {

        const attachments = email.attachments.map((item, index) => ({
            filename: `${email.customer}${(index === 0) ? '' : index}.pdf`,
            content: item,
            encoding: 'base64',
        }));

        const options = {
            from: process.env.EMAIL_USER,
            to: email.reciver,
            subject: email.provider || '',
            text: email.message || '',
            attachments,
        };

        await transporter.sendMail(options);        

        //LOGS
        console.info(sysStrings.email.successMessage)
        return { success: true, message: appStrings.dataSaved +' '+ appStrings.email.success };
        
    } catch (mailError) {
        console.error(sysStrings.email.failedMessage);        
        return { success: false, message: appStrings.email.failed, error: mailError };
    }
}
