'use client';
import { formFieldMap } from '@/app/utils/AppContent';
import { FieldsObject, PdfField, PdfForm } from '@/app/utils/types/formTypes'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Field from './Field';
import { SearchableDropdownHandle } from './SearchableDropdown';
import { useTechnician } from '../../hooks/useTechnician';
import { useManufacture } from '../../hooks/useManufacture';
import { Technicians } from '@/app/utils/types/entities';
import { isStorageForm } from '@/app/utils/helper';
import { newFormFieldsMap, isDynamicForm } from '../../helpers/formHelper';


const generateFormBlocks = (staticFields: PdfField[], dynamicFields: PdfField[]) => {   
    
    const generatedBlocks = Object.entries(formFieldMap).map(([key, value]) => {                
        return {            
            name: key,
            fields: staticFields.filter((field: any) => (value.includes(field.name) && field.require))
        };
    }).filter(block => block.fields.length);

    //todo: we need an num increment in tbl_panel_num field
    if (dynamicFields.length) {        
        generatedBlocks.push({
            name: 'bizpermittbl1',
            fields: dynamicFields
        })
        
    }

    return generatedBlocks
};


interface Props {
    form: PdfForm;
    updateFields: (fields: FieldsObject[]) => void;
    registerRef: (ref: SearchableDropdownHandle | null) => void;
}

const FormFields = ({ form, updateFields, registerRef }: Props) => {
    
    const { technicians } = useTechnician();
    const { manufactures } = useManufacture();
    
    const [ provider, setProvider ] = useState<string | boolean>(false);
    const [ showStorage, setShowStorage ] = useState(false);        
    const [ dynamicFields, setdynamicFields ] = useState<PdfField[]>([]);
    
    const dynamicBlocksSize = useRef<number>(1);

    const formFieldsRef = useRef<HTMLDivElement | null>(null);     
    const formBlocks = useMemo(() => generateFormBlocks(form.formFields, dynamicFields), [form.formFields]);
    
    //console.log('FormFields.render=>form.formFields',form.formFields)

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
        //todo: add new fields in seperate block
        const newFields = newFormFieldsMap['bizPermit']?.(dynamicBlocksSize.current, form.name) || [];        
        form.formFields = [...form.formFields, ...newFields];
        dynamicBlocksSize.current++;
        setdynamicFields((prev) => [...prev, ...newFields]);
        //        
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
                                    technicians={ technicians } 
                                    manufactures={ manufactures }
                                    dropdownChange={ handleDropdownChange }
                                    />
                                    
                            ))}                    
                        </div>                        
                    </div>
                );
            })}

            {isDynamicForm(form.name) && <button type="button" onClick={ addNewFields } className="mt-4 text-blue-500 hover:text-blue-700">
                הוסף לוח חשמל
            </button>}

        </div>        
        </>    
    )
}

export default FormFields