import { PdfField } from "@/app/utils/types/formTypes";

// export const BlockFields: PdfField[] = [
    
// ]

export const EmberInspect: PdfField[] = [
    {
        name: 'pname',
        type: 'TextField',
        require: false,     
    },
    {
        name: 'plicense',
        type: 'TextField',
        require: false,        
    },
    {
        name: 'pphone',
        type: 'TextField',
        require: false,        
    },
    {
        name: 'pemail',
        type: 'TextField',
        require: false,        
    },
    {
        name: 'date',
        type: 'TextField',
        require: false,        
    },
    {
        name: 'site',
        type: 'TextField',
        require: true,  
        label: 'שם המתקן אתר/וכתובתו',      
    },
    {
        name: 'client',
        type: 'TextField',
        require: true,  
        label: 'שם מזמין הבדיקה',      
    },
    {
        name: 'system',
        type: 'TextField',
        require: true,  
        label: 'המתקן',      
    },
    {
        name: 'location',
        type: 'TextField',
        require: true,  
        label: 'מקום',      
    },
    {
        name: 'feedsource',
        type: 'TextField',
        require: true,  
        label: 'מקור ההזנה',      
    },
    {
        name: 'size',
        type: 'TextField',
        require: true,  
        label: 'גודל מבטח',      
    },
    {
        name: 'unit',
        type: 'TextField',
        require: true,  
        label: 'יח׳ מתקן',      
    },
]
