'use client';
import { facillties, fieldsNameMap } from '@/app/utils/AppContent';
import { ListOption, PdfField } from '@/app/utils/types/formTypes';
import React from 'react'
import SearchableDropdown, { SearchableDropdownHandle } from './SearchableDropdown';
import { Manufacture, Technicians } from '@/app/utils/types/entities';
import { OptionKeys, OptionsMap } from '@/app/utils/types/customTypes';

interface Props {
    formName: string;
    field: PdfField;
    registerRef: (ref: SearchableDropdownHandle | null) => void;
    provider: string | boolean;
    technicians: Technicians[];
    manufactures: Manufacture[];
    dropdownChange: (value: string, name: string, id?: number) => void;
}

// todo this is only for DropDown, consider move it to different location repo or file
const getOptionsMap = (technicians: Technicians[], manufactures: Manufacture[], provider: string | boolean): OptionsMap => ({
    provider: Array.from(new Set(technicians.map((tech) => tech.employer))),
    electrician: technicians
        .filter((tech) => tech.profession === 'electrician' && tech.employer === provider)
        .map((tech) => ({ val: tech.name, id: tech.id })),
    planner: technicians
        .filter((tech) => tech.profession === 'planner' && tech.employer === provider)
        .map((tech) => ({ val: tech.name, id: tech.id })),
    convertor: manufactures
        .filter((item) => item.type === 'convertor' || item.type === 'both')
        .map((item) => item.name),
    panel: manufactures
        .filter((item) => item.type === 'panel' || item.type === 'both')
        .map((item) => item.name),
    facillity: facillties
});


// const _renderField = (field: PdfField): JSX.Element => {

//     if (field.type === 'DropDown') {
//         const optionsMap = getOptionsMap(technicians, manufactures, provider);
//         // Ensure TypeScript recognizes 'name' as a valid key
//         const getListOptions = (name: string): string[] | ListOption[] => optionsMap[name as OptionKeys] || [];
    
//     }


//     return <div></div>

// }

const Field = ({ formName, field, registerRef, technicians, manufactures, provider, dropdownChange }: Props) => {
    //console.log('Field=>',field)
    /**
     * todo: try to remove FieldType outside of the render
     * optionsMap & getListOptions only required for DropDown, so dont check every field
     */
    const optionsMap = getOptionsMap(technicians, manufactures, provider);
    // Ensure TypeScript recognizes 'name' as a valid key
    const getListOptions = (name: string): string[] | ListOption[] => optionsMap[name as OptionKeys] || [];

    const FieldType: Record<string, JSX.Element> = {
        DropDown: (
            <SearchableDropdown 
                ref={registerRef} 
                options={field.options || getListOptions(field.name.replace("-ls", ""))} 
                fieldName={field.name}  
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
                type="text" 
                name={field.name} 
                required 
            />
        )
    }

    return (
        <div key={`field-${field.name}`} className="form-item my-2 flex">
            
            <label className="block content-center text-sm min-w-20 font-medium text-black">
                {fieldsNameMap[field.name.replace("-ls", '')]}:
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

