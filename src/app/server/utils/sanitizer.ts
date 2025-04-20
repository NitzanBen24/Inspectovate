

import { formModel } from '@/app/utils/types/entities';
import { PdfField } from '@/app/utils/types/formTypes';
import sanitizeHtml from 'sanitize-html';


const _sanitizeValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return sanitizeHtml(value.trim(), { allowedTags: [], allowedAttributes: {} });
  }
  return value as any;
};

const _sanitizePdfFields = (fields: PdfField[]): PdfField[] => {
  return fields.map((field) => ({
    ...field,
    name: typeof field.name === 'string'
      ? sanitizeHtml(field.name.trim(), { allowedTags: [], allowedAttributes: {} })
      : field.name,
    value: typeof field.value === 'string'
      ? sanitizeHtml(field.value.trim(), { allowedTags: [], allowedAttributes: {} })
      : field.value,
  }));
};

export const sanitizeFormModel = (form: formModel): formModel => {
    const sanitized: Partial<formModel> = {};
  
    for (const key in form) {
      if (key === 'fields') continue; // handle this explicitly later
  
      const value = form[key as keyof formModel];
      sanitized[key as keyof formModel] = _sanitizeValue(value) as any;
    }
  
    sanitized.fields = _sanitizePdfFields(form.fields);
  
    return sanitized as formModel;
  };