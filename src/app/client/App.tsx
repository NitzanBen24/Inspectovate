'use client';
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './contexts/userContext';
import Main from './Main';


const queryClient = new QueryClient();

const App = () => {
console.log('App.render')
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <Main />
            </UserProvider>
            
        </QueryClientProvider>
        
    )
}

export default App