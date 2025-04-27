
import { dropDownOptionsMap } from "@/app/utils/AppContent";
import { PdfField, PdfForm } from "@/app/utils/types/formTypes"
import { PDFCheckBox, PDFField, PDFFont, PDFForm, PDFTextField, TextAlignment } from "pdf-lib";
import { options } from "sanitize-html";

const _containsHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);
const _containsDigits = (text: string) => /\d/.test(text);
const _reverseNumbersInHebrewText = (text: string) => text.replace(/\d+/g, (match) => match.split('').reverse().join(''));


export const reverseEnglishAndNumbers = (text: string): string  => {
    return text.replace(/\b([^\u0590-\u05FF\s]+)\b/g, (match) => {
        return [...match].reverse().join('');
    });
}

//todo: Review new field proccess, test and optimize 
export const pdfFillerFields: any = {

    'PDFTextField': (data: {fieldName: string, pdfForm: PDFForm, form: PdfForm, hfont: PDFFont, efont: PDFFont}) => {
        
        const textField = data.pdfForm.getTextField(data.fieldName);
                    
        if (!textField) return; // Ensure field exists before setting values


        let formField = data.form.formFields.find((item: PdfField) => item.name === data.fieldName);

        if (formField === undefined || formField.value?.length === 0) {
            return;
        }

        let fieldText = formField.value || '';

        const hasHebrew = _containsHebrew(fieldText);
        const hasDigits = _containsDigits(fieldText);

        if (hasHebrew && hasDigits) {      
            fieldText = _reverseNumbersInHebrewText(fieldText);
        }

        textField.setText(fieldText);

        if (hasHebrew) {
            textField.setAlignment(TextAlignment.Right);
            textField.updateAppearances(data.hfont);
        } else {
            textField.setAlignment(TextAlignment.Left);
            textField.updateAppearances(data.efont);
        }
    },
    'PDFCheckBox': (pdfForm: PDFForm, formFields: PdfField[]) => {              
        formFields.forEach(field => pdfForm.getCheckBox(field.name + '_' + field.value).check());
    }
}

export const pdfFormFields: any = {
    //todo 'PDFTextField' & 'tblField' same code
    'PDFTextField': (fields: PDFField[]) => {      
        console.log('pdfFormFields.PDFTextField!!',fields)          
        return fields.map((field) => {            
            //console.log('constructor!!', field instanceof PDFTextField )
            const fieldName = field.getName();
            const fieldType = (fieldName.endsWith('-ls')) ? 'DropDown' : 'PDFTextField';
            return {
                name: fieldName,
                type: fieldType,
                require: field.isRequired(),
                //todo get options, your are in server
            };
        });
    },
    'PDFCheckBox': (checkBoxs: PDFCheckBox[], formName: string) => {
        const fieldMap: Record<string, PdfField> = {};
        const checkBoxesNames = checkBoxs.map(item => item.getName());

        checkBoxesNames.forEach(str => {
            // Match the part before "_" correctly using a better regex
            const match = str.match(/^([a-zA-Z0-9]+)_(.+)$/);// todo after we get options form dropDownOptionsMap we dont need to regex (we wont have the value in the ending of the name)                         
            if (match) {                
                const [, name, option] = match;  // Extract name and option                
                if (!fieldMap[name]) {
                    fieldMap[name] = {
                        name,
                        type: 'DropDown',
                        require: true,
                        value: '',
                        options: []//todo consider get option from dropDownOptionsMap instead of the ending of the field name
                    };
                }                         
                fieldMap[name].options!.push(option);  // Push the option to the respective field's options
            }
        });
        
        return Object.values(fieldMap);  // Return the fields with their options
    },
    'tblField': (fields: PDFField[], formName: string) => {        
        return fields.map((field) => {            
            const fieldName = field.getName();
            const fieldType = (fieldName.endsWith('-ls')) ? 'DropDown' : 'PDFTextField';            
            return {
                name: fieldName,
                type: fieldType,
                require: field.isRequired(),                
                options: dropDownOptionsMap[formName][fieldName]                
            };
        }); 
    }
}