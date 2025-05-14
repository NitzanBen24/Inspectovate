'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { FieldsObject, PdfForm } from '@/app/utils/types/formTypes';
import { useUser } from '../../hooks/useUser';
import { addInspectionFields, calcPower, dynamicForms, formatHebrewDate } from '../../helpers/formHelper';
import { SearchableDropdownHandle } from './SearchableDropdown';
import { useImageUpload, usePost } from '../../hooks/useQuery';
import { appStrings, checkBoxesValue } from '@/app/utils/AppContent';
import { getHebrewFormName } from '@/app/utils/helper';
import { Spinner } from '../ui/Spinner';
import Modal from '../ui/Modal';
import AttachFile from '../AttachFile';
import SignaturePad  from '../SignaturePad'
import ChevronDownIcon from '@heroicons/react/16/solid/ChevronDownIcon';
import { Button } from 'react-bootstrap';
import FormFields from './FormFields';
import { AxiosError } from 'axios';



interface Props {
    form: PdfForm,
    close: () => void,
}

const Form = ({ form, close }: Props) => {
    
    const { user } = useUser();    
    const [ images, setImages ] = useState<File[] | string[]>([]);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);                
    const [ message, setMessage ] = useState<string>('');
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ signature, setSignature ] = useState<string | null>(null);
    const [ showSignature, setShowSignature ] = useState(false);

    
    const sendMail = useRef(false);    
    const formRef = useRef<HTMLDivElement | null>(null);       
    const dropdownRefs = useRef<SearchableDropdownHandle[]>([]);// Array of DropDown lists refs
    const attachmentsRef = useRef<{ clear: () => void } | null>(null);

    //Ensures the refs are added to the dropdownRefs array when the component is mounted.
    const registerRef = (ref: SearchableDropdownHandle | null) => {        
        if (ref) {
            dropdownRefs.current.push(ref);
        }
    };    

    useEffect(() => {        
        // fill existing data of the form, if exists => edit action
        formRef.current?.querySelectorAll<HTMLElement>('.form-field').forEach((item) => {              
            if (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement) {                               
                const inputField = form.formFields.find((field) => field.name === item.name)                  
                item.value =  inputField?.value || ''; // Clear the value for input and textarea                               
            }   
        });
    }, [form.formFields])

   // console.log('Form.render=>',form)

    const handleSubmitSuccess = (res: any) => {   
        
        if (form.status === 'sent') {
            form.status = 'done';
            sendMail.current = true;
            submitForm(form);
        } else {
            setLoading(false);            
            if (res.success) {
                clearAttchedFiles();
                cleanForm();
            }            
            setMessage(res.message); 
            openModal();        
        }
    }
    
    const handleSubmitError = (error: any) => {              
        setLoading(false);
        setMessage(appStrings.actionFailed +' '+ appStrings.saveFailed);
        openModal();        
    }    
    const { mutate: formSubmit, isPending } = usePost(
        'forms',
        ['formRecords'],
        handleSubmitSuccess,
        handleSubmitError
    );

    const handleUploadError = (error: any) => {                
        setLoading(false);
        setMessage(appStrings.storage.uploadFailed);
        openModal();
    }
    const handleUploadSuccess = (res: any) => {             
        attachImagesSorce(res);
        submitForm(form);
    }
    const { mutate: imageUploader } = useImageUpload(
        'upload', 
        'images', 
        handleUploadSuccess,
        handleUploadError,        
    );

    const attachImagesSorce = (data: any) => {
        //todo: add error method to component => stop proccess and pop up modal with the error message
        if(!data.folderName) {
            return;
        }
        form.images = data.folderName;
    }

    const goBack = () => close();

    const setDate = () => setFields([{['date']: formatHebrewDate()}]);
  
    const cleanForm = () => {              
        if (!formRef.current) {
            goBack();
            return;
        }
                
        formRef.current.querySelectorAll<HTMLElement>('.form-field').forEach((item) => {            
            if (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement) {                
                item.value = ''; // Clear the value for input and textarea
            }             
        });

        form.formFields.forEach((item) => {            
            delete item.value;            
        });
        
        //inspections form only
        if (form.name === 'inspection') {// || form.name === 'בדיקה'
            const fieldsToRemove = ['status'];
            form.formFields = form.formFields.filter((item) => !fieldsToRemove.includes(item.name));    
        }        
        
        form.status = 'new';
        delete form.id;         

        /**
         * check the array of refs, why so many
         */
        clearDropdowns();// Clear all DropDowns
    }

     // Clear all DropDwons
    const clearDropdowns = () => {
        if (!dropdownRefs.current) return;
        dropdownRefs.current.forEach((ref) => ref.clear());
    };

    const setFormStatus = (btnId: string) => {
        /** todo: add only send action, no saving the form
         * you need to set status to set for permit forms
         * maybe try to set an action based on the form name
         * make sure to keep the the split save and send submit for tcelctric forms
         */
        if (btnId === 'BtnSave') {       
            form.status = 'saved';        
        }

        if (btnId === 'BtnSend') {        
            //tood: refactor => dynamic form are sent also with role user  
            if (user.role === 'admin' || (user.role === 'supervisor' && form.name !== 'inspection') || dynamicForms.includes(form.name)) {
                form.status = 'sent';                
            } else {
                form.status = 'pending';
            }     
            
            if (user.role === 'basic') {
                form.status = 'sent';
            }
        }
    }

    /** todo: change function name */
    const prepareToSend = () => { 

        if (form.name === 'inspection') {

            const newFields = addInspectionFields(form.formFields, formRef);    
            setFields(newFields);

            const ppower = calcPower(formRef.current);
            if (ppower) {
                setFields([{['ppower']: ppower.toString()}]);
            }

            // Inspections result
            let statusVal = formRef.current?.querySelector<HTMLInputElement>('[name="status"]:checked')?.value;
            if (statusVal) {
                form.formFields.push({
                    name: 'status',
                    type: 'TextArea',
                    require:false,
                    value:statusVal,
                })
            } 
        }
        
        setDate();        

    }
    
    const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {            
        
        if (!event.currentTarget.id) {
            console.error('Error can not submit Form!!')
            setMessage('Something went wrong, can not submit Form!');
            openModal()
        }
        
        setLoading(true);
        
        setFormStatus(event.currentTarget.id);
        
        prepareToSend();

        fillFormFields();
    
        if (images.length > 0) {            
            imageUploader({
                images: images as File[],                
                userId: user?.id
            });
        } else {                                
            submitForm(form);
        }
    };

    const fillFormFields = () => {
        const fieldsCollection = formRef.current?.getElementsByClassName('form-field');
        if (fieldsCollection) {
            [...fieldsCollection].forEach(field => {
                const inputField = field as HTMLInputElement | HTMLTextAreaElement;                     
                const fieldName = inputField.getAttribute('name'); // Get the name attribute                
                let fieldValue = inputField.value;
                if (fieldName) {                                       
                    const currFiled = form.formFields.find((item) => item.name === fieldName);                    
                    if (currFiled) {
                        //todo: consider Optimize 
                        if (fieldName.startsWith('check')) {                            
                            fieldValue = checkBoxesValue[form.name]?.[fieldName]?.[fieldValue] || fieldValue;                         
                        }
                        
                        currFiled.value = fieldValue;
                    }                    
                }                 
            });
        }
    }

    const submitForm = (submissionForm: PdfForm) => {        
        formSubmit({
            userId: submissionForm.userId || user.id, 
            userName: submissionForm.userName || user.name,
            role: user.role,
            form: submissionForm,
            company_id: submissionForm.company_id || user.company_id,            
            sendMail: sendMail.current,
            action: 'submit'//todo => use action to add only send submmition to permit forms
        });
        
    }

    const setFields = useCallback((fields: FieldsObject[]) => {        
        fields.forEach(item => {            
            const [key, value] = Object.entries(item)[0];            
            const field = form.formFields.find(f => f.name === key);            
            if (field) {
                field.value = value;
            }
        });        
    }, [form.formFields]);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const clearAttchedFiles = () => {
        attachmentsRef.current?.clear();
        delete form.images;
        setImages([]);
    }

    const saveSignature = () => {
        
        //console.log('saveSignature.type=>',typeof signature)
        if (signature) {
            // console.log('dataURLtoBlob=>',dataURLtoBlob(signature))
            // console.log('saveSignature.type=>',typeof dataURLtoBlob(signature))
            form.signature = signature;
        }
        
    }

    const updateFormFields = useCallback((formFields: FieldsObject[]) => setFields(formFields), [ form.formFields ])

    const updateImages = useCallback((files: File[]) => {   
        setImages(files);
    }, [ images ]);


    return (
        <>        
        
        <div className='mx-auto p-2 form-wrap'  key={form.name+'.form'}>
            <div className='form-head flex'>
                <div className='p-2'>            
                    <FontAwesomeIcon icon={faArrowLeft} onClick={goBack} />
                </div>
                <h2 className='text-2xl font-bold flex-grow text-right text-gray-800'>{ getHebrewFormName(form.name) }</h2>
            </div>            
            <div ref={ formRef } className='form-body my-2'>                   
                
                {/* { renderBlocks }   */}
                <FormFields form={ form } updateFields={ updateFormFields } registerRef={ registerRef } />
                {/* 
                    this is only for inspection form
                    indicate if the test has passed or faild 
                    consider move this to seperate file/repo
                */}
                {/** change field name stauts to different name, the meaning is if inspection passed or not */}
                {/* {form.name === 'inspection' && <div className='flex status-wrap mt-3'>
                    <label className='block text-sm min-w-20 content-center font-medium text-black'>תוצאה:</label>
                    <div className='flex items-center'>
                        <label className='block text-sm content-center font-medium text-black' htmlFor="status-complete">עבר:</label>
                        <input className='mx-2' type="radio" name='status' value="complete" defaultChecked={true} id='status-complete' />
                        <label className='block text-sm content-center font-medium text-black' htmlFor="status-complete">לא עבר:</label>
                        <input className='mx-2' type="radio" name='status' value="incomplete" id='status-incomplete' />
                    </div>                    
                </div>} */}

            </div>

            {isLoading && <Spinner />}

            <div className='form-btns'>
                <button id='BtnSend' className='w-full border-2 border-black text-blck px-4 mt-3 py-2 rounded-lg' type="button" onClick={handleFormSubmit} disabled={isPending}>
                    שלח
                </button>
                {user.role !=='basic' && <button id='BtnSave' className='w-full border-2 border-black text-blck px-4 mt-3 py-2 rounded-lg' type="button" onClick={handleFormSubmit} disabled={isPending}>
                    שמור
                </button>}
            </div>

            {/* {    
                <div onClick={() => setShowSignature(!showSignature)} className='add-sign-tab flex justify-end'>
                    <span className='flex my-2'>                        
                        <ChevronDownIcon className="size-6"/>
                        {getHebrewString('signature')}
                    </span>                    
                </div>
            }
            { showSignature && <SignaturePad onSave={setSignature}/>}
            
            { showSignature && <button onClick={saveSignature}>sign</button>} */}

            {  
                (!dynamicForms.includes(form.name)) && (form.images ? <div className='py-2 text-right text-green-500'>{appStrings.attchmentsExists}</div> 
                            : <AttachFile ref={attachmentsRef} updateFiles={updateImages}/> )
            }                                
            
        </div>

        {/** Todo: add headline to Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            {/* <h2>This is a modal!</h2> */}
            <p>{message}</p>
        </Modal>
                    

        </>
        
    );

};

export default Form;

