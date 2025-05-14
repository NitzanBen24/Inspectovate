import { PdfField, PdfForm } from "./types/formTypes";


export const isStorageForm = (block: PdfField[]): boolean => {     
  return block.filter((field) => field.name === 'batteries' || field.name === 'capacity' || field.name === 'bmanufacture').some((item) => {
      if (item.value && item.value.length > 0) {                          
          return true;            
      }                       
      return false;
  });    
}

// Function to check if specific fields exist and have a non-empty value
export const elementsWithValueExist = (array: PdfField[], fieldNames: string[]): boolean => {
    return fieldNames.every((fieldName) => {
        const field = array.find((item) => item.name === fieldName);
        return field?.value !== undefined && field.value.trim() !== ''; // Ensure value is non-empty
    });
};

export const getHebrewFormName = (fileName: string) : string => {
    const names: any = {
		inspection: 'בדיקה', 
		elevator: 'מעליות', 
		charge: 'עמדת טעינה', 
		schindler: 'שינדלר מעליות',
		bizpermit: 'רישוי עסקים',
		inspectest: 'סולארי דוגמא',
    	firehoses: 'טופס 1 זרנוקים גלגלונים',
		workpermit: 'טופס 3 רישוי עסקים',
		fireequip: 'טופס 2 ציוד כיבוי'
	};

    return names[fileName] || '';
}

export const getEnglishFormName = (fileName: string) : string => {
    const names: any = {
		 'בדיקה': 'inspection',
		 'מעליות': 'elevator',
		 'טעינה': 'charge',
		 'שינדלר מעליות': 'schindler',
		 'רישוי עסקים': 'bizpermit'
	};

    return names[fileName] || '';
}

export const getQueryFields = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value) // Filter non-empty values
    );
};

export const getHebrewString = (str: string): string => {
    // todo: consoder move to appContent
    const hebrewStrings: Record<string, string> = 
      {
        files: 'בחר טופס',
        saved: 'שמורים',
        pending: 'מחכים לחיוב',
        sent: 'נשלחו לחיוב',
        inspection: 'בדיקה',
        storage: 'אגירה',
        charge: 'טעינה',
        elevator: 'מעליות',
        archvie: 'ארכיון',
        signature: 'הוסף חתימה',
        evolt: 'evolt',
        inspectest: 'דוגמא בדיקה',
        schindler: 'שינדלר',
        bizpermit: 'רישוי עסקים',
      }
  
    return hebrewStrings[str];
  }

export const isEmptyProps = (obj: Record<string, any>): boolean =>  Object.values(obj).every(value => !value);


export function validatePDFResult(pdfFiles: any): any {
    if ('error' in pdfFiles) {
        throw new Error(`Failed to get pdfFiles: ${pdfFiles.error}`);
    }
    return pdfFiles;
}

export function findPdfFile(pdfFiles: PdfForm[], name: string): PdfForm {
    return pdfFiles.find((file) => file.name === name) as PdfForm;
}

// Convert Base64 to Blob
export const dataURLtoBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
