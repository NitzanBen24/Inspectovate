import React, { useEffect, useState } from 'react'
import { Manufacture, Technicians } from '@/app/utils/types/entities';
import { useManufacture } from '../hooks/useManufacture';
import { useTechnician } from '../hooks/useTechnician';
import { useMultiFetch } from '../hooks/useQuery';
import { Spinner } from '../components/ui/Spinner';
import FormsDashboard from '../components/forms/FormsDashboard';



const HomeView = () => {
    //console.log('Home.Render=>')  
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded      
    const { techniciansSet } = useTechnician();
    const { manufacturesSet } = useManufacture();
    const { isLoading, isError, data } = useMultiFetch<[        
        Manufacture[],
        Technicians[],        
      ]>([        
        { key: "manufactures", path: "get-data/manufactures" },
        { key: "technicians", path: "get-data/technicians"},
      ]);
    
    const [ manufactures, technicians ] = (data ?? [[], []]) as [
        Manufacture[],
        Technicians[]
      ];
    
    useEffect(() => {
        if (!isLoading && !isError && !isDataLoaded) {             
            // Set data once after the initial fetch
            techniciansSet(technicians);
            manufacturesSet(manufactures);
            setIsDataLoaded(true); // Mark data as loaded
        }
    }, [isLoading, isError, isDataLoaded]);
    
    
    if (isLoading) return <Spinner />
    if (isError) return <div>Error loading data.</div>;      

  
    return (
        <FormsDashboard />
    )
}

export default HomeView