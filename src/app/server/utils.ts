import { FieldsObject } from "../utils/types/formTypes";
import sanitizeHtml from 'sanitize-html';

export const sanitizeFields = (fields: FieldsObject): FieldsObject => {
    
    const sanitized: FieldsObject = {};
    
    for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
            sanitized[key] = sanitizeHtml(fields[key], { allowedTags: [], allowedAttributes: {} });
        }
    }

    return sanitized;
};

export const handleError = (message: string, details?: any) => {
    console.error(message, details);
    return { success: false, message, error: details || message  };
};
