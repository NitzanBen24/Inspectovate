'use client'
import React, { use, useEffect, useState } from 'react'
import LoginForm from './views/LoginForm';
import { useUser } from './hooks/useUser';
import { useFetch, usePost } from './hooks/useQuery';
import { TechniciansProvider } from './contexts/TechniciansContext';
import { ManufactureProvider } from './contexts/ManufacturesContext';
import { Container } from 'react-bootstrap';
//import Home from './views/Home';
import { AuthFail, AuthResponse } from '../utils/types/apiTypes';
import { isAuthResponse } from '../utils/auth/typeGuards';
import { Spinner } from './components/ui/Spinner';
import AppHeader from './components/ui/AppHeader';
import FormsDashboard from './components/forms/FormsDashboard';
import HomeView from './views/HomeView';
import { FormFieldsProvider } from './contexts/FormFieldsContext';



const Main = () => {
    
    const { user, logIn, logOut } = useUser();

    const  { data: userAuth, isLoading } = useFetch<AuthResponse | AuthFail>(
        'users', 
        'auth', 
        { 
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 10 * 60 * 1000,
            cacheTime: 15 * 60 * 1000,
        }
    );

    const { mutate: userAuthMutation } = usePost('auth','users', () => logOut());    

    useEffect(() => {    
        if (userAuth && isAuthResponse(userAuth)) {            
            logIn(userAuth.user);       
        }        
    }, [ userAuth ]);

    
    if (isLoading) return <Spinner />;
    if (!user.isLoggedIn) return <LoginForm />;

    return (
        <>            
            <AppHeader logOutUser={ () => userAuthMutation({}) } />
                    
            <ManufactureProvider>
            <TechniciansProvider>
            <FormFieldsProvider>
                <Container fluid className='main-container'>                    
                    <HomeView />
                </Container>
            </FormFieldsProvider>                
            </TechniciansProvider>
            </ManufactureProvider>
              
        </>
    )
}

export default Main