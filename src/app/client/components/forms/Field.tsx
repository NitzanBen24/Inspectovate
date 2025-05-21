'use client';
import { dropDownOptionsMap, fieldsNameMap } from '@/app/utils/AppContent';
import { PdfField } from '@/app/utils/types/formTypes';
import React, { useMemo } from 'react'
import SearchableDropdown, { SearchableDropdownHandle } from './SearchableDropdown';
import { Manufacture, Technicians } from '@/app/utils/types/entities';
import { getInspectionDropdownOptions } from '../../helpers/fieldhelper';
import { useTechnician } from '../../hooks/useTechnician';
import { useManufacture } from '../../hooks/useManufacture';

interface Props {
    formName: string;
    field: PdfField;
    registerRef: (ref: SearchableDropdownHandle | null) => void;
    provider: string | boolean;
    dropdownChange: (value: string, name: string, id?: number) => void;    
}

const Field = ({ formName, field, registerRef, provider, dropdownChange }: Props) => {    

    const { technicians:techs } = useTechnician();
    const { manufactures: manus } = useManufacture();

    const setFieldLabel = useMemo(() => {        
        const rawKey = field.type === 'DropDown' ? field.name.replace('-ls', '') : field.name;
        
        return fieldsNameMap[rawKey] ?? fieldsNameMap[rawKey.slice(0, -1)];
    }, [field]) ;

    const inputType = (field.name === 'setdate' || field.name === 'nextdate') ? 'date' : 'text';

    const FieldType: Record<string, JSX.Element> = {        
        DropDown: (() => {            
            let dropdownOptions = field.options || getInspectionDropdownOptions(field, techs, manus, provider);            
            
            // todo: consider refactor
            if(field.name.startsWith('check')){//if (formName === 'bizpermit' && field.name === 'checkswitch') {                
                dropdownOptions = dropDownOptionsMap?.[formName]?.[field.name] || dropdownOptions;
            }
            /** todo: saved checkbox fields, ths value is the oprion in English => change to Hebrew */
            return (
                <SearchableDropdown 
                    ref={registerRef} 
                    field={field}  
                    options={dropdownOptions}                                 
                    text="חפש"
                    value={field.value || ''} 
                    onValueChange={dropdownChange} 
                />
            );
        })(),        
        TextArea: (
            <textarea 
                className="form-field mt-1 w-full border border-gray-300 rounded-lg shadow-sm" 
                name={field.name} 
                rows={3}
                required
            />
        ),
        TextField: (
            <input 
                className="form-field mt-1 w-full border border-gray-300 rounded-lg shadow-sm"                 
                type={inputType}
                name={field.name}
                required 
            />
        )
    }

    //console.log('Field.render=>')

    return (
        <div className="form-item my-2 flex">
            
            <label className="block content-center text-sm min-w-20 font-medium text-black">
                {setFieldLabel || field.label}:
            </label>               
            
            { FieldType[field.type] || FieldType.TextField}

            {formName === 'inspection' && field.name === 'omega' && (
                <>
                    <label className="block content-center mr-2 text-sm min-w-10 py-auto font-medium text-black">
                        תקין:
                    </label>
                    <input type="checkbox" name="ocheck" defaultChecked={true} />
                </>
            )}
        </div>
    );
}

export default Field;

