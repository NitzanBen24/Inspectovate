  
import fs from 'fs';
import path from 'path';


export const handleError = (message: string, details?: any) => {
    console.error(message, details);
    return { success: false, message, error: details || message  };
};


export const formatDateRTL = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); 

    return `${day}.${month}.${year}`;
};

export function getImageBase64(imageFilename: string): string {
    const imagePath = path.join(process.cwd(), 'public/img/dee', imageFilename); // e.g., 'logo.png'
    const imageData = fs.readFileSync(imagePath); // returns Buffer
    return imageData.toString('base64');
}
