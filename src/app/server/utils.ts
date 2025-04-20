import { FieldsObject } from "../utils/types/formTypes";
import sanitizeHtml from 'sanitize-html';

export const handleError = (message: string, details?: any) => {
    console.error(message, details);
    return { success: false, message, error: details || message  };
};
