import { PDFDocument as PDFLibDocument, PDFPage, PDFFont, TextAlignment, PDFImage, PDFForm } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import { PdfField, PdfForm } from "@/app/utils/types/formTypes";
import { pdfFillerFields, pdfFormFields, reverseEnglishAndNumbers } from '../utils/pdfUtils';


function _extraFields(fileName: string): PdfField[] {
    
    const moreFields = [];
    if (fileName === 'inspection') {
        moreFields.push('message', 'provider','batteries','capacity', 'bmanufacture');
    }

    if (fileName !== 'bizpermit' && fileName !== 'schindler') {
        moreFields.push('comments')
    }
    
    return moreFields.map((item) => ({
        name: item,
        type: 
        item === 'provider' ? 'DropDown' : 
        item === 'comments' || item === 'message' ? 'TextArea' : 'TextField',
        require: true,
    }));
  }

const _loafPDF = async (path: string): Promise<PDFLibDocument> => {
    const existingPdfBytes = await fs.promises.readFile(path);
    return await PDFLibDocument.load(new Uint8Array(existingPdfBytes));                                          
}

const _addInspectionRep = (form: PdfForm): PdfField[] => {

    const _representatives: any = {
        ['ויקטור']: { name: 'עומר חטאב', phone: '0523477016'},
        ['גרינטופס']: { name: 'יעקוב בוחבוט', phone: '05245319026'},
    }

    const providerValue = form.formFields.find(field => field.name === 'provider')?.value || '';
	const repFacillity = _representatives[providerValue] || {}; // Ensures it's an object


	const repField = form.formFields.find(field => field.name === 'rep');
	const repPhoneField = form.formFields.find(field => field.name === 'repphone');

	if (repField && repFacillity.name) {
		repField.value = repFacillity.name;
	}

	if (repPhoneField && repFacillity.phone) {
		repPhoneField.value = repFacillity.phone;
	}

    return form.formFields;
}

const _embedToPngOrJpg = async (pdf: PDFLibDocument, images: any[]): Promise<PDFImage[]> => {
    
    const embedImages = [];
    for (const img of images) {

        if (!img.data) continue; // Skip if there's an error
    
        const fileType = img.data.type; // Extract MIME type
        if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
            console.warn(`Skipping unsupported image type: ${fileType}`);
            continue;
        }
    
        const arrayBuffer = await img.data.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
    
        const image = fileType === 'image/png' 
            ? await pdf.embedPng(uint8Array) 
            : await pdf.embedJpg(uint8Array);
    
        embedImages.push(image);
    }        

    return embedImages;
    

    
}

const _addImagesToDoc = async (pdf: PDFLibDocument, lastPage: PDFPage, images: PDFImage[]) => {    
    /** Refactor, make a responsice image grid depends on num of images */
    try {
        const padding = 20; // Space from the top
        const imagesPerPage = 4; // Adjust as needed
        
        let currentPage: PDFPage | null = null;
        //Limit to 1 page with max 4 images inside
        for (let i = 0; i < images.length && i < 4; i++) {
            
            const image = images[i];            
            
            if (!image) continue;

            if (i % imagesPerPage === 0) {                                
                currentPage = pdf.addPage(lastPage);
            }
        
            const maxWidth = 260; // Adjust based on PDF size
            const originalWidth = image.width;
            const originalHeight = image.height;

            // Scale proportionally
            const scaleFactor = maxWidth / originalWidth;
            const newWidth = maxWidth;
            const newHeight = originalHeight * scaleFactor;

            const x = (i % 2) * 300 + 20; // Two columns        
            const y = 400 - Math.floor((i % imagesPerPage) / 2) * 300 - padding; // Adjust for padding

            currentPage?.drawImage(image, {
                x,
                y,
                width: newWidth,
                height: newHeight,
            });
        }
    } catch(error) {
        console.error('Error, could not add images to pdf:',error);                
    }
}

const _markInspectionResult = (pdfForm: PDFForm, pdfDoc: PDFLibDocument, fields: PdfField[], bold: PDFFont) => {
    /** todo: in client change status name */
    let statusField = fields.find((item: PdfField) => item.name === 'status');
    if (statusField?.value) {      
        if (statusField.value == 'complete') {
            pdfForm.getTextField('approve').updateAppearances(bold);
        } else if ((statusField.value == 'incomplete')) {
            pdfForm.getTextField('decline').updateAppearances(bold);
            if (pdfDoc.getPages().length - 2) {
                pdfDoc.removePage(pdfDoc.getPages().length - 2)
            }        
        }
    }
}

function _addComments(doc: PDFLibDocument, fields: PdfField[], hebrewFont: PDFFont) {

    const comments = fields.find((item: PdfField) => item.name === 'comments');    
  
    if (comments && comments.value) {
  
      const lastPage = doc.getPage(doc.getPages().length - 1);
      const pageSize = lastPage.getSize();
      const margin = 50;
      const maxWidth = pageSize.width - margin * 2;
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
  
      // Split text by newlines first
      const lines = comments.value.split('\n').flatMap((line) => _wrapText(line, hebrewFont, fontSize, maxWidth));
  
      let yPosition = pageSize.height - 200;
  
      lines.forEach((line) => {
        if (yPosition < margin) return;
  
        // Calculate the line width to align it to the right for RTL
        const lineWidth = hebrewFont.widthOfTextAtSize(line, fontSize);
        const xPosition = pageSize.width - margin - lineWidth;
  
        //also revese parentheses
        line = reverseEnglishAndNumbers(line).replace(/[()]/g, (char) => (char === '(' ? ')' : '('));
  
        lastPage.drawText(line, {
          x: xPosition,
          y: yPosition,
          size: fontSize,
          font: hebrewFont,
        });
  
        yPosition -= lineHeight;
      });
    }
} 
  
function _wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {

    const words = text.split(' ')
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth <= maxWidth) {
        currentLine = testLine;
        } else {
        lines.push(currentLine);
        currentLine = word;
        }
    });

    if (currentLine) lines.push(currentLine);

    return lines;
}

/** 
 * hfont = Hebrew
 * efont = English
 */
const _fillPdfFields = async (pdfForm: PDFForm, form: PdfForm, hfont: PDFFont, efont: PDFFont) => {
    
    if (form.company_id === 4 && form.name === 'inspection') {
        form.formFields = _addInspectionRep(form)
    }

    // Text fields
    const fields = pdfForm.getFields();
    
    fields
        .filter(field => field.constructor.name === 'PDFTextField')
        .forEach((field) => {            
            const fieldName = field.getName();
            const fieldType = field.constructor.name;
            pdfFillerFields[fieldType]?.({fieldName, pdfForm, form, hfont, efont});
        })
    
    // CheckBox fields      
    const checkBoxes = fields.filter(field => field.constructor.name === 'PDFCheckBox').map(item => item.getName());        
    if (checkBoxes.length) {
        pdfFillerFields['PDFCheckBox']?.(pdfForm, form.formFields.filter(field => field.name.startsWith('check')));                
    }
        
};

const _getFormFields = (pdfForm: PDFForm, formName: string): PdfField[] => {
    
    const pdfFields = pdfForm.getFields();
    console.log('pdfFields!!',pdfFields)
    // CheckBox fields 
    const checkFields: PdfField[] = pdfFormFields['PDFCheckBox'](pdfFields.filter(field => field.constructor.name === 'PDFCheckBox'), formName);    
    
    // tbl Fields
    const tblFields: PdfField[] = pdfFormFields['tblField']?.(pdfFields.filter(field => (field.getName().startsWith('tbl_') && field.isRequired())), formName);

    // Text fields
    const fields: PdfField[] = pdfFormFields['PDFTextField']?.(pdfFields.filter(field => (field.constructor.name === 'PDFTextField' && !(field.getName().startsWith('tbl_')))));
console.log('textFields!!',fields)
    // Combine both arrays (regular fields and checkbox fields)    
    return [...fields, ...checkFields, ...tblFields];
};

// Get PDF files
export const getPdfForms = async (fileNames: string[]): Promise<{ forms: PdfForm[], success: boolean, error?: unknown }> => {
    const forms: PdfForm[] = []; 
  
    try {
        const pdfFolder = path.resolve('./public/templates');
        // Get all PDF files asynchronously
        const pdfNames = (await fs.promises.readdir(pdfFolder)).filter(file => file.endsWith('.pdf'));      
        
        for (const fileName of pdfNames) {
            const filePath = path.join(pdfFolder, fileName);
            const form: PdfForm = { name: fileName.replace('.pdf', ''), formFields: [], status: 'new' }; // Initialize form                    
                                
            if (fileNames.includes(form.name)) {   
    
                try {
                    // Load and parse PDF document                                                    
                    const pdfDoc = await _loafPDF(filePath);
                    const pdfForm = pdfDoc.getForm();                  
                    console.log('check.filePath!!',filePath)
                    if (pdfForm) {                        
                        form.formFields = _getFormFields(pdfForm, form.name);
                        console.log('formfields!!',form.formFields)
                    }

                    form.formFields.push(..._extraFields(form.name));
                    
                    // Only push forms with fields
                    if (form.formFields.length > 0) {
                        forms.push(form);
                    }
                    
                } catch (error) {
                    throw new Error(`Error processing file ${fileName}:`)                
                }                    
            }
        }
      
        return { forms, success: true };
    } catch (pdfError) {
        console.error('Error generating PDFs:', pdfError);
        return { forms: [], success: false, error: pdfError };     
    }

    
};

// Add user data to pdf file
export const generateDocumnet = async (form: PdfForm): Promise<Uint8Array | []> => {//Consider in the feuture to maybe return error in catch

    try {
        // Load the original PDF with pdf-lib
        const pdfPath = path.resolve('./public/templates/'+form.name+'.pdf');    
        const pdfDoc = await _loafPDF(pdfPath);
      
        // Register fontkit to use custom fonts
        pdfDoc.registerFontkit(fontkit);
    
        // Load the Noto Sans Hebrew font from your local path
        const fontPath = path.resolve('./src/app/fonts/OpenSans-VariableFont_wdth,wght.ttf');
        const boldFontPath = path.resolve('./src/app/fonts/OpenSans-Bold.ttf');  
        const arielFontPath = path.resolve('./src/app/fonts/OpenSans-VariableFont_wdth,wght.ttf');        
        
        const fontBytes = fs.readFileSync(fontPath);
        const boldFontBytes = fs.readFileSync(boldFontPath); 
        const openSunsFontBytes = fs.readFileSync(arielFontPath); 
            
        const hebrewFont = await pdfDoc.embedFont(new Uint8Array(fontBytes));    
        const boldFont = await pdfDoc.embedFont(new Uint8Array(boldFontBytes));        
        const openSunsFont = await pdfDoc.embedFont(new Uint8Array(openSunsFontBytes));        
    
        // Fill form fields in the main PDF with pdf-lib    
        const pdfForm = pdfDoc.getForm();
    
        _fillPdfFields(pdfForm, form, hebrewFont, openSunsFont);
    
        // only for ispections form
        if (form.name === 'inspection') {    
            _markInspectionResult(pdfForm, pdfDoc, form.formFields, boldFont)        
        }

        //todo: move this to a seperate function
        if (form.name === 'schindler') {
            form.formFields.push({
                name: 'customer',
                type: 'PDFTextField',
                require: true,
                value: 'שינדלר'
              })
        }
        if (form.name === 'bizpermit') {            
            form.formFields.push({
                name: 'customer',
                type: 'PDFTextField',
                require: true,
                value: form.formFields.find(field => field.name === 'regnum')?.value || 'bizpermit',
              })
        }
        
        const pageCount = pdfDoc.getPageCount();    
        let lastPage: PDFPage | null = null;
    
        if (pageCount > 0) {
            [ lastPage ] =  await pdfDoc.copyPages(pdfDoc, [pageCount - 1]);        
        }
        
        if (form.name !== 'storage') {        
            _addComments(pdfDoc, form.formFields, hebrewFont);
        }
      
        if (form.images && lastPage) {
            const embedImages = await _embedToPngOrJpg(pdfDoc, form.images);     
            if (embedImages.length > 0) {
                await _addImagesToDoc(pdfDoc,lastPage, embedImages)
            }        
        }
        
        /** todo: add signature to file, handle design */
        // if (form.signature) {
        //     const [ lastPage ]: PDFPage[] =  await pdfDoc.copyPages(pdfDoc, [pageCount - 1]);
        //     const sigIamge = await pdfDoc.embedPng(form.signature);
        //     lastPage.drawImage(sigIamge, {
        //         x: 100,
        //         y: 150,
        //         width: 200,
        //         height: 100,
        //     })
        //     pdfDoc.addPage(lastPage);
        // }
      
        //Make file read only
        //form.flatten();
        
        // Save the edited PDF and return
        return await pdfDoc.save();
  
    } catch (pdfError: any) {
        console.error('Error generating PDF:', pdfError.message);
        return []
    }
};