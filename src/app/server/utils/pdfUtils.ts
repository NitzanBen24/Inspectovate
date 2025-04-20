
import { PdfField, PdfForm } from "@/app/utils/types/formTypes"
import { PDFCheckBox, PDFField, PDFFont, PDFForm, TextAlignment } from "pdf-lib";

const _containsHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);
const _containsDigits = (text: string) => /\d/.test(text);
const _reverseNumbersInHebrewText = (text: string) => text.replace(/\d+/g, (match) => match.split('').reverse().join(''));

export const reverseEnglishAndNumbers = (text: string): string  => {
    return text.replace(/\b([^\u0590-\u05FF\s]+)\b/g, (match) => {
        return [...match].reverse().join('');
    });
}

export const pdfFillerFields: any = {

    'PDFTextField': (data: {fieldName: string, pdfForm: PDFForm, form: PdfForm, font: PDFFont}) => {
        
        const textField = data.pdfForm.getTextField(data.fieldName);
                    
        if (!textField) return; // Ensure field exists before setting values

        let formField = data.form.formFields.find((item: PdfField) => item.name === data.fieldName);
        
        let fieldText = formField?.value || textField.getText() || '';

        const hasHebrew = _containsHebrew(fieldText);
        const hasDigits = _containsDigits(fieldText);

        if (hasHebrew && hasDigits) {
            fieldText = _reverseNumbersInHebrewText(fieldText);
        }

        textField.setText(fieldText);

        if (hasHebrew) {
            textField.setAlignment(TextAlignment.Right);
            textField.updateAppearances(data.font);
        } else {
            textField.setAlignment(TextAlignment.Left);
        }
    },
    'PDFCheckBox': (pdfForm: PDFForm, checkBoxes: PDFCheckBox[], formFields: PdfField[]) => {        
        formFields.forEach(field => pdfForm.getCheckBox(field.name + '_' + field.value).check())
    }
}

export const pdfFormFields: any = {
    'PDFTextField': (fields: PDFField[]) => {
        return fields.filter(item => item.constructor.name !== 'PDFCheckBox').map((field) => {
            
            const fieldName = field.getName();
            const fieldType = (fieldName.endsWith('-ls')) ? 'DropDown' : field.constructor.name;
            
            return {
                name: fieldName,
                type: fieldType,
                require: field.isRequired(),
            };
        });
    },
    'PDFCheckBox': (checkBoxs: PDFCheckBox[]) => {
        const fieldMap: Record<string, PdfField> = {};
        const checkBoxesNames = checkBoxs.map(item => item.getName());

        checkBoxesNames.forEach(str => {
            // Match the part before "_" correctly using a better regex
            const match = str.match(/^([a-zA-Z0-9]+)_(.+)$/);                              
            if (match) {
                const [, name, option] = match;  // Extract name and option
                if (!fieldMap[name]) {
                    fieldMap[name] = {
                        name,
                        type: 'DropDown',
                        require: true,
                        value: '',
                        options: []
                    };
                }
                fieldMap[name].options!.push(option);  // Push the option to the respective field's options
            }
        });
        
        return Object.values(fieldMap);  // Return the fields with their options
    },
}