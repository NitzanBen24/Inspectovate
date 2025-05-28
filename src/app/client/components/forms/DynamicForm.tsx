'use client'
import { DynamicBlock, EmberBlock, PdfField } from '@/app/utils/types/formTypes';
import React, { useRef } from 'react'
import { useState } from 'react';
import BlockInput from './BlockInput';
import { useGeneratePdf } from '../../hooks/usePdfForm';
import { EmberInspect } from '../../data/formFields';
import Field from './Field';
import { SearchableDropdownHandle } from './SearchableDropdown';
import { appStrings, checkBoxesValue } from '@/app/utils/AppContent';
import { User } from '@/app/utils/types/entities';
import Modal from '../ui/Modal';
import { Spinner } from '../ui/Spinner';

interface Props {
    user: User;
}

const DynamicForm = ({ user }: Props) => {

    const [ blocks, setBlocks ] = useState<number>(0);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false); 
    const [ isLoading, setLoading ] = useState<boolean>(false);

    const msgRef = useRef<string>('');
    const formFieldsRef = useRef<PdfField[]>(EmberInspect)
    const formRef = useRef<HTMLDivElement | null>(null);      
    const blockRefs = useRef<EmberBlock[]>([]);

    const dropdownRefs = useRef<SearchableDropdownHandle[]>([]);
    
    // todo: consider to remove
    const registerRef = (ref: SearchableDropdownHandle | null) => {        
        if (ref) {
            dropdownRefs.current.push(ref);
        }
    };        

    const handleSucces = (res: any) => {    
        setLoading(false); 
        msgRef.current = res.message || '';
        cleanForm();
        openModal();   
    }
    const handleError = (error: any) => {
        setLoading(false); 
        msgRef.current = appStrings.actionFailed +' '+ appStrings.saveFailed;
        openModal()   
    }
    const { mutate: generatePdf } = useGeneratePdf(handleSucces, handleError);    

    const addBlock = () => {
        blockRefs.current.push({                
            ohm: '',
            depreciation: '',
            time: '',
            eboard: ''
        });
        setBlocks((prev) => prev + 1); // Just to trigger re-render when adding/removing blocks
    };

    const updateBlock = (index: number, field: keyof EmberBlock, value: string) => {        
        if (blockRefs.current[index]) {
            blockRefs.current[index][field] = value;
        }
    };
    
    const removeBlock = (index: number) => {
        blockRefs.current.splice(index, 1); // Remove the block from the refs
        setBlocks(prev => prev - 1); // Trigger re-render
    };

    const cleanForm = () => {
        
        if (!formRef.current) {         
            return;
        }

        formRef.current.querySelectorAll<HTMLElement>('.form-field').forEach((item) => {            
            if (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement) {                
                item.value = ''; // Clear the value for input and textarea
            }             
        });

        formFieldsRef.current.forEach((item) => {            
            delete item.value;            
        });

        blockRefs.current = [];
        setBlocks(0);
    }

    const fillStaticFields = () => {
        const fieldsCollection = formRef.current?.getElementsByClassName('form-field');
        if (fieldsCollection) {
            [...fieldsCollection].forEach(field => {
                const inputField = field as HTMLInputElement | HTMLTextAreaElement;                     
                const fieldName = inputField.getAttribute('name'); // Get the name attribute                
                let fieldValue = inputField.value;
                if (fieldName) {                                       
                    const currFiled = formFieldsRef.current.find((item) => item.name === fieldName);                    
                    if (currFiled) {
                        currFiled.value = fieldValue;
                    }                    
                }                 
            });
        }        
    }

    const handleSubmit = () => {
        setLoading(true);
        fillStaticFields();
        const staticFields = formFieldsRef.current;
        const dynamicBlocks = blockRefs.current;
        generatePdf({ user, staticFields, dynamicBlocks });
    };
      
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
        <div className="main-wrapp my-3 p-4">
            <div ref={ formRef } className='form-body'>
                <h2>תעודת רשום ובדיקה של מתקן חשמלי</h2>
                {formFieldsRef.current.filter(field => field.require).map(field => {
                    return <Field
                                key={`field-${field.name}`} 
                                registerRef={ registerRef } 
                                formName={ '' }
                                field={ field } 
                                provider= { '' }                                    
                                dropdownChange={ ()=>{} }
                                changeRequired= {() => {}}
                            />
                })}            

                {blockRefs.current.map((block, i) => (
                    <BlockInput key={i} block={block} index={ i } onChange={updateBlock} remove={removeBlock} />//
                ))}
                <button className="border-2 border-black text-blck px-4 mt-3 py-2 rounded-lg" onClick={addBlock}>הוסף לוח חשמל</button>
                {isLoading && <Spinner />}
                <button className="w-full border-2 border-black text-blck px-4 mt-3 py-2 rounded-lg" onClick={handleSubmit}>שלח טופס</button>
            </div>
        </div>

        {/** Todo: add headline to Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            {/* <h2>This is a modal!</h2> */}
            <p>{msgRef.current}</p>
        </Modal>

        </>      
    );
}

export default DynamicForm