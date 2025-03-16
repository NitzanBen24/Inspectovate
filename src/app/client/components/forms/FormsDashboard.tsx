import React, { useMemo, useState } from 'react'
import Form from './Form';
import FormsList from './FormsList';
import Archvie from "../Archive";

import { useFetch } from '../../hooks/useQuery';
import { Spinner } from '../ui/Spinner';
import { useUser } from '../../hooks/useUser';
import { PdfForm } from '@/app/utils/types/formTypes';



/** check maybe to remove to a different file a seperate from here */
const RenderFormsLists = ({ records, selectForm }: { records: any[]; selectForm: (form: PdfForm) => void }) => {
    return (    
      <>
        {records.map((list, index) =>
          Object.keys(list).map((key) => {
            const forms = list[key] as PdfForm[];          
            const addFilter = key !== 'files';
            const showList = key === 'files' || key === 'pending';
            if (forms.length === 0) return null;
            
            return (
              <FormsList
                key={`${index}-${key}`} openForm={selectForm} title={key} addFilter={addFilter} forms={forms} display={showList} />
            );
          })
        )}
      </>
    );
  };
  
  
const FormsDashboard = () => {
    const { user } = useUser();
    const [ form, setForm ] = useState<PdfForm | undefined>();
    const { data, isLoading, isError } = useFetch<PdfForm[]>(
        'formRecords', 
        `forms/${user.id}`,
        {            
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            staleTime: 5 * 60 * 1000, 
            cacheTime: 15 * 60 * 1000,
        }
    )
    //console.log('Dashboard.forms=>data',data)
    const  forms  = (data ?? { pdfFiles: [], activeForms: [] }) as 
        { pdfFiles: PdfForm[]; activeForms: PdfForm[] };    

    // Memoize the sortedRecords to avoid recalculating unnecessarily
    const sortedRecords = useMemo(() => {
        // Filter and organize the records by status
        const files = forms.pdfFiles.filter((item) => item.name !== 'storage');// without storage form (אגירה)
        const saved = forms.activeForms.filter((item) => item.status === 'saved' && item.userId === user.id.toString());
        const pending = forms.activeForms.filter((item) => item.status === 'pending');
        const sent = user.role !== 'user' ? forms.activeForms.filter((item) => item.status === 'sent') : [];

        return [
            { files },
            { saved },
            { pending },
            { sent },
        ];
    }, [forms, user.id, user.role]);
    
    const selectForm = (cform: PdfForm) => {
      setForm(cform);
    }
    const closeForm = () => setForm(undefined);  
  
    if (isLoading) return <Spinner />
    if (isError) return <div>Error loading data.</div>;    
    
    //console.log('DaschBoard.forms=>',forms)
    
    return (    

        <div className='main-wrapp my-3'>
            {form ? (
            <Form close={closeForm} form={form} />
            ) : (     
             <>        
                 <RenderFormsLists records={sortedRecords} selectForm={selectForm} /> 
                 { (user.role !== 'user') && <Archvie selectForm={selectForm}/> }
            </>   
            )}      
        </div>        
    );
  };
  
  export default FormsDashboard;
  