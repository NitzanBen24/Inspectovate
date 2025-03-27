import { PdfField } from '@/app/utils/types/formTypes';

import { createContext, useState, ReactNode } from 'react';

export const FormFieldsContext = createContext<{
    fields: PdfField[];
    setFormFields: (fields: PdfField[]) => void;
    setFieldsValues: (fields: PdfField[]) => void;
}| undefined >(undefined)


export const FormFieldsProvider = ({ children }: { children: ReactNode }) => {

    const [ fields, setFields ] = useState<PdfField[]>([]);

    const setFormFields = (fields: PdfField[]) => {
        setFields(fields)
    }

    const setFieldsValues = (updateFields: PdfField[]) => {
        setFields((prevFields) =>
            prevFields.map((field) => {
                const updatedField = updateFields.find((uf) => uf.name === field.name);
                return updatedField ? { ...field, value: updatedField.value } : field;
            })
        );
    };

    


    return (
        <FormFieldsContext.Provider value={{fields, setFormFields, setFieldsValues}}>
            { children }
        </FormFieldsContext.Provider>
    )
}