'use client';
import { formFieldMap } from '@/app/utils/AppContent';
import { FieldsObject, FormBlocks, PdfField, PdfForm } from '@/app/utils/types/formTypes'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Field from './Field';
import { SearchableDropdownHandle } from './SearchableDropdown';
import { useTechnician } from '../../hooks/useTechnician';
import { isStorageForm } from '@/app/utils/helper';
import { dynamicForms, getFormBlock } from '../../helpers/formHelper';


const generateFormBlocks = (staticFields: PdfField[], blocks: FormBlocks[], blockSize: number) => {
  
    const generatedBlocks = Object.entries(formFieldMap).map(([blockName, fieldNames]) => {
        
        const fields = staticFields.filter((field) => field.require && fieldNames.includes(field.name));  
        return fields.length ? { name: blockName, fields } : null;

    }).filter(Boolean) as { name: string; fields: PdfField[] }[];

    // add dynamic fields
    if (blockSize) {
        return [...generatedBlocks, ...blocks]
    }

    return generatedBlocks;

};

// todo: add dynamic block to edited form
//const addSavedDynamicBlock = (formFields: PdfField[], dynamicFields: PdfField[]) => {}

interface Props {
    form: PdfForm;
    updateFields: (fields: FieldsObject[]) => void;
    registerRef: (ref: SearchableDropdownHandle | null) => void;
}

const FormFields = ({ form, updateFields, registerRef }: Props) => {
    
    const { technicians } = useTechnician();    
    
    const [ provider, setProvider ] = useState<string | boolean>(false);
    const [ showStorage, setShowStorage ] = useState(false);            
    const [ dynamicBlocks, setdynamicBlocks ] = useState<FormBlocks[]>([]);    
    
    const formFieldsRef = useRef<HTMLDivElement | null>(null);     
    const formBlocks = useMemo(() => generateFormBlocks(form.formFields, dynamicBlocks, dynamicBlocks.length), [form.formFields]);

    //console.log('formFileds.render=>')

    useEffect(() => {
        // check if storage form 
        if (form.name === 'inspection' && isStorageForm(form.formFields)) {            
            toggleStorageFields();              
        }
    }, [form.formFields]);
  
    const toggleStorageFields = () => {
        setShowStorage(prev => !prev);
    }
    
    const handleDropdownChange = useCallback((value: string, name: string, id?: number) => {           
        if (name === 'provider') {
            /** todo clean technicians info from form.formfields */
            setProvider(value)
        }            
        if (id && (name === 'electrician-ls' || name === 'planner-ls')) setTechniciansDetails(name, value, id);
    },[]);

    const setTechniciansDetails = (type: string, val: string, id: number ) => {    
        
        const technician = technicians.find((item) => item.id === id)
        if (technician) {
            let typeChar = type[0];               
            updateFields([
                {[type]: technician.name || ''}, 
                {[typeChar+'email']: technician.email || ''}, 
                {[typeChar+'license']: technician.license || ''}, 
                {[typeChar+'phone']: technician.phone || ''}
            ])            
        }                                 
    } 

    const addNewFields = () => {        
        const blockSize = dynamicBlocks.length + 1;        
        const newFields = getFormBlock(form.name, blockSize);
        if (newFields.length) {                        
            form.formFields = [...form.formFields, ...newFields];
            setdynamicBlocks((prev) => [
                ...prev ,
                {
                    name: form.name+ 'tbl' + blockSize,
                    fields: newFields,       
                }
            ]);                               
        }
    }

    const showTechInfoFields = (fieldName: string) => {

        const checkFeilds = ['eemail', 'ephone', 'elicense','pemail', 'pphone', 'plicense']        
        
        const updatedFields = form.formFields.map(field => {
            const fn = field.name.replace("-ls", "");
            if (checkFeilds.includes(fn) && fn[0] === fieldName[0]) {
                return { ...field, require: true };
            }
            return field;
        });

        form.formFields = updatedFields;        
        setdynamicBlocks((prev) => [...prev]);   
    }

    return (
        <>
        <div ref={ formFieldsRef } className='form-body my-2'>            
            {formBlocks.map((block, index) => {
                // If no fields are found for this block, return null                 
                if (!block.fields || block.fields.length === 0) return null;
                
                return (
                    <div key={`block-${block.name}-${index}`}>                            
                        {form.name === 'inspection' && block.name === 'storage' && (
                            <label key={'storage-lable'} onClick={ toggleStorageFields } className="storage-toggle flex pt-2 content-center text-gray-400 text-sm min-w-10 py-auto font-medium ">
                                טופס אגירה:                                   
                            </label>                                        
                        )}                                                        
                        <div 
                            className={`form-block py-2 border-b-2 border-slate-800 ${block.name}`}
                            style={{ display: block.name === 'storage' && !showStorage ? 'none' : 'block' }}>
                            {block.fields.map(field => (
                                <Field 
                                    key={`field-${field.name}`} 
                                    registerRef={registerRef} 
                                    formName={ form.name }
                                    field={ field } 
                                    provider= { provider }                                    
                                    dropdownChange={ handleDropdownChange }
                                    changeRequired={showTechInfoFields}
                                    />                                    
                            ))}                    
                        </div>                        
                    </div>
                );
            })}

            {dynamicForms.includes(form.name) && <button type="button" onClick={ addNewFields } className="mt-4 text-blue-500 hover:text-blue-700">
                הוסף לוח חשמל  
            </button>}

        </div>        
        </>    
    )
}

export default FormFields