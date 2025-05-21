'use client';
import { useMutation } from '@tanstack/react-query';
import { generatePdf } from '../services/pdf';


/**
 * Custom hook to call generatePdf mutation.
 */
export function useGeneratePdf(onSuccess?: (data: any) => void, onError?: (data: any) => void) {
    return useMutation({
        mutationFn: generatePdf,
        onSuccess: (data) => {            
            onSuccess?.(data);
        },
        onError: (error) => {            
            onError?.(error);
        },
    });
}
  
