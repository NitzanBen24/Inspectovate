'use client';
import { dropDownOptionsMap, facillties, fieldsNameMap } from '@/app/utils/AppContent';
import { ListOption, PdfField } from '@/app/utils/types/formTypes';
import React, { useMemo } from 'react'
import SearchableDropdown, { SearchableDropdownHandle } from './SearchableDropdown';
import { Manufacture, Technicians } from '@/app/utils/types/entities';
import { OptionKeys, OptionsMap } from '@/app/utils/types/formTypes';
import { getOptionsMap } from '../../helpers/fieldhelper';

interface Props {
    formName: string;
    field: PdfField;
    registerRef: (ref: SearchableDropdownHandle | null) => void;
    provider: string | boolean;
    technicians: Technicians[];
    manufactures: Manufacture[];
    dropdownChange: (value: string, name: string, id?: number) => void;    
}

const Field = ({ formName, field, registerRef, technicians, manufactures, provider, dropdownChange }: Props) => {    

    const getFieldOptions = useMemo(() => {    
        //todo get inspection dropdown option in server
        //todo get getOptionsMap only for inspection and -ls field
        const optionsMap = getOptionsMap(technicians, manufactures, provider);
        const fieldName = field.name.replace("-ls", "");
        
        //todo: Optimize
        if (formName === 'bizpermit') {            
            field.options = dropDownOptionsMap[formName][field.name]
        }

        return field.options || optionsMap[fieldName as OptionKeys];
    },[field.options, technicians, manufactures, provider, field.name])

    const setFieldLabel = useMemo(() => {        
        const rawKey = field.type === 'DropDown' ? field.name.replace('-ls', '') : field.name;
        
        return fieldsNameMap[rawKey] ?? fieldsNameMap[rawKey.slice(0, -1)];
    }, [field]) ;

    const inputType = field.name === 'setdate' ? 'date' : 'text';

    const FieldType: Record<string, JSX.Element> = {
        DropDown: (
            <SearchableDropdown 
                ref={registerRef} 
                field={field}  
                options={getFieldOptions}                                 
                text="חפש"
                value={field.value || ''} 
                onValueChange={dropdownChange} 
            />
        ),
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
                {setFieldLabel}:
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

