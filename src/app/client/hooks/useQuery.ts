import { QueryConfig } from "@/app/utils/types/apiTypes";
import { UploadPayload } from "@/app/utils/types/payloads";
import { useQuery, useMutation, UseQueryResult, UseMutationResult, useQueries, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";


const _apiKey = process.env.NEXT_PUBLIC_API_KEY;  // Access client-side API key

const fetchData = async <T>(path: string): Promise<T> => {
    
    const { data } = await axios.get(`/api/${path}`, {
        headers: {
            'Authorization': `Bearer ${_apiKey}`, // Add the API key here
        }
    });
    
    return data;
    
};

export const useFetch = <T>(key: string, path: string, options: Record<string, any>): UseQueryResult<T> => {         
    return useQuery({
        queryKey: [key],         
        queryFn: () => fetchData<T>(path),
        ...options,
    } as UseQueryOptions<T, Error>);
};


export const useMultiFetch = <T extends unknown[]>(queries: QueryConfig<T[number]>[]) => {    
    const queryResults = useQueries({
        queries: queries.map(({ key, path }) => ({
            queryKey: [key],
            queryFn: () => fetchData<T[number]>(path),                    
            refetchOnWindowFocus: false,
            staleTime: 0,            
            cacheTime: 60 * 1000,
        })),
    }) as UseQueryResult<T[number]>[];

    // Derived global states for loading and error
    const isLoading = queryResults.some((result) => result.isLoading);
    const isError = queryResults.some((result) => result.isError);

    // Extracting data in a consistent shape
    const data = queryResults.map((result) => result.data ?? null);

    return { queryResults, isLoading, isError, data };
};


// Function to handle POST requests (send data)
const postData = async <T, R>(path: string, payload: T): Promise<R> => {

    const { data } = await axios.post(`/api/${path}`, payload, {
        headers: {
            Authorization: `Bearer ${_apiKey}`,  // Add API key to headers
        },
    });

    return data;
    
};

export const usePost = <T, R = any>(
    path: string,
    mutationKey: string | string[], // mutationKey for invalidating queries
    onSuccess?: (data: R) => void,
    onError?: (error: AxiosError) => void
): UseMutationResult<R, AxiosError, T> => {
    const queryClient = useQueryClient();

    return useMutation<R, AxiosError, T>({
        mutationFn: (payload: T) => postData<T, R>(path, payload),
        onSuccess: (data) => {
            // Invalidate the query using the mutationKey            
            queryClient.invalidateQueries({
                queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
            });

            // Call the optional onSuccess callback
            onSuccess?.(data);
        },
        onError: (error) => {            
            // Call the optional onError callback
            onError?.(error);
        },
    });
};


// Function to handle PATCH requests (update data)
const patchData = async <T, R>(path: string, payload: T): Promise<R> => {
    const { data } = await axios.patch(`/api/${path}`, payload, {
        headers: {
          Authorization: `Bearer ${_apiKey}`,  // Add API key to headers
        },
      });
    return data;
};

export const usePatch = <T, R = any>(
    path: string,
    mutationKey: string | string[],
    onSuccess?: (data: R) => void,
    onError?: (error: AxiosError) => void
): UseMutationResult<R, AxiosError, T> => {
    const queryClient = useQueryClient();

    return useMutation<R, AxiosError, T>({
        mutationFn: (payload: T) => patchData<T, R>(path, payload),
        onSuccess: (data) => {
            // Invalidate the query using the mutationKey
            queryClient.invalidateQueries({
                queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
            });
            // Call the optional onSuccess callback
            onSuccess?.(data);
        },
        onError: (error) => {
            // Call the optional onError callback
            onError?.(error);
        },
    });
};


const deleteData = async <T,R>(path: string, payload: T): Promise<R> => {
    const { data } = await axios.delete(`/api/${path}`, {
        data: payload,
        headers: {
            Authorization: `Bearer ${_apiKey}`,  // Add API key to headers
          },
    });
    return data;
};


export const useDelete = <T,R = any>(
    path: string,
    mutationKey: string | string[], // Key to invalidate queries
    onSuccess?: (data: R) => void,
    onError?: (error: AxiosError) => void
): UseMutationResult<R, AxiosError, T> => {
    const queryClient = useQueryClient();

    return useMutation<R, AxiosError, T>({
        mutationFn: (payload: T) => deleteData<T,R>(path, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
            });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};


const uploadData = async <R>(path: string, payload: UploadPayload): Promise<R> => {
    const formData = new FormData();
    // Append each file to the FormData
    payload.images?.forEach((img, index) => {            
      formData.append('image', img);
    });
    
    if (payload.userId) {
        formData.append('userId', payload.userId)
    }
    

    //try {
    const { data } = await axios.post(`/api/${path}`, formData, {
        headers: {
          'Authorization': `Bearer ${_apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
    });
      
    return data; // Assuming the response returns an array of image URLs
    // } catch (error: any) {
    //     console.log('error.here=>',error)
    //     throw new Error(error.response?.data?.message || 'Image upload failed');
    // }
};
  
  
export const useImageUpload = < R = any>(
    path: string,
    mutationKey: string | string[], // to invalidate queries related to image upload
    onSuccess?: (imageUrls: string[]) => void,
    onError?: (error: AxiosError) => void
  ) => {
    const queryClient = useQueryClient();
  
    return useMutation<R, AxiosError, UploadPayload>({
      mutationFn: (payload) => uploadData<R>(path, payload),
      onSuccess: (data) => {
        // Invalidate any queries associated with the mutationKey
        queryClient.invalidateQueries({
          queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
        });
  
        // Call onSuccess callback with the array of image URLs
        onSuccess?.(data as string[]);
      },
      onError: (error) => {
        // Call onError callback if there is an error
        onError?.(error);
      },
    });
};