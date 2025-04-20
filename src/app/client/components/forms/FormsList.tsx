'use client';
import React, { useState } from 'react';

import { AxiosError } from 'axios';
import Modal from '../ui/Modal';


import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { PdfForm } from '@/app/utils/types/formTypes';
import { useDelete, usePatch } from '../../hooks/useQuery';
import { getHebrewString, isStorageForm } from '@/app/utils/helper';
import { Spinner } from '../ui/Spinner';
import { reverseDateDirection } from '../../helpers/formHelper';
import { appStrings } from '@/app/utils/AppContent';
import { mkdirSync } from 'fs';
import { useUser } from '../../hooks/useUser';




interface Props {
    forms: PdfForm[];
    addFilter: boolean;
    title: string;
    display: boolean;
    openForm: (form:PdfForm) => void;
}

const FormsList = ({ forms, openForm, title, addFilter, display }: Props) => {
  
    const { user } = useUser();
    const [ show, setShow ] = useState<boolean>(display);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>('');
    const [ isLoading, setLoading ] = useState<boolean>(false);

    const onUpdateSucces = (data: any) => {
        setLoading(false)
        setMessage(data.message); 
        openModal();
    }
    const onUpdateError = (error: any) => {        
        setLoading(false)
        setMessage(appStrings.actionFailed +' '+ appStrings.form.updateFail);
        openModal(); 
    }
    /** todo: change mutate name */
    const { mutate: updateStatus } = usePatch(
        'forms',    
        ['formRecords'],
        onUpdateSucces,
        onUpdateError,
    )

    const onDeleteSuccess = (data: any) => {    
        setLoading(false)
        setMessage(appStrings.form.delete); 
        openModal();
    };
    const onDeleteError = (error: AxiosError) => {        
        setLoading(false)
        setMessage(appStrings.actionFailed +' '+ appStrings.form.updateFail);
        openModal(); 
    };
    const { mutate: deleteForm } = useDelete(
        'forms', // API path
        ['formRecords'],
        onDeleteSuccess,
        onDeleteError
    );

    const changeFormStatus = (event: React.MouseEvent, form: PdfForm) => {

        setLoading(true);        

        const formId = form.id?.toString();
        if (!formId) {
            console.error('Form ID is missing!');
            return;
        }
        
        if (form.status === 'saved') {
            deleteForm({ 
                id: formId, 
                formName: form.name,
                userId: user.id,
                company_id: user.company_id,
            });
        }

        if (form.status === 'sent') {
            updateStatus({ 
                id: formId, 
                status: 'archive', 
                formName: form.name,
                userId: user.id,
                company_id: user.company_id,
                action:'single'
            });
        }
        event.stopPropagation();
    };

    const removeAll = () => {        
        updateStatus({ 
            userId: user.id,
            company_id: user.company_id,
            action:'all'
        });
    }

    const handleClick = (form: PdfForm) => {
        openForm(form);
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => { 
        setIsModalOpen(false);
    }

    const toggleList = () => {
        setShow(!show)
    }
    
    console.log('FormList=>',forms)

    return (
        <>
        {forms.length > 0 && <div className='form-list flex flex-col border-gray-400 border-bottom py-2 px-4'>
            <h2 className='flex text-lg cursor-pointer' onClick={toggleList}>
                {getHebrewString(title)}
                {/* <ChevronDown />             */}
                {title && <ChevronDownIcon className="size-6"/>}
            </h2>
            {title === 'sent' && 
                <div className='flex flex-row-reverse'>
                    <button
                        className={` ${show ? '' : 'hidden'} btn-remove px-1 border-2 border-black bg-white text-black rounded-lg`}
                        onClick={removeAll}
                        >
                        הסר הכל
                    </button>
                </div>
                }

            {isLoading && <Spinner />}
            <ul className='p-0 flex flex-col-reverse'>  
                {show && forms.map((form) => {
                    const isStorage = isStorageForm(form.formFields); // Check once per form
                    return (
                        <li
                            className={`form-list-item py-1 grid grid-cols-5 gap-3 place-items-center border-gray-400 border mb-1 rounded-md ${
                            isStorage ? "bg-cyan-50" : "bg-white"
                            }`}
                            key={form.name + form?.id}
                            onClick={() => handleClick(form)}
                        >
                            <span>{getHebrewString(form.name)}</span>
                            <span>{form.formFields.find((item) => item.name === "customer")?.value || ""}</span>                    
                            <span>{form?.userName}</span>
                            <span>{typeof form?.created_at === "string" ? reverseDateDirection(form.created_at.slice(0, 10)) : ""}</span>
                            <div>                  
                            {form.status !== "new" && form.status !== "pending" && form.status !== 'archive' && (
                                <button
                                    className="btn-remove px-1 border-2 border-white bg-black text-white rounded-lg"
                                    onClick={(event) => changeFormStatus(event, form)}
                                    >
                                    הסר
                                </button>
                            )}
                            </div>
                        </li>
                    );
                })}
                {show && addFilter 
                      && <li
                            className='form-list-item grid grid-cols-5 gap-3 place-items-center mb-2'
                            key={getHebrewString(title)}
                            >
                            <span>שם טופס:</span>
                            <span>לקוח:</span>                
                            <span>בודק:</span>
                            <span>תאריך:</span>
                        </li>}
            </ul>
        </div>}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
                {/* <h2>This is a modal!</h2> */}
                <p>{message}</p>
            </Modal>
        </>
    )
}

export default FormsList