'use client'; // Enable client-side rendering in Next.js 14

import { User } from '@/app/utils/types/entities';
import { createContext, useState, ReactNode } from 'react';


export const UserContext = createContext<{
    user: User;
    logIn: (user:User) => void;
    logOut: () => void;
  } | undefined>(undefined);
  
  // UserProvider component to provide user context
  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ isLoggedIn: false, id:0, name:'', email: '' , role:'', company_id: -1});//, company_name: ''
  
    // Function to log in the user
    const logIn = (user: User) => setUser({ 
      isLoggedIn: true, 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      company_id: user.company_id, 
      // company_name: user.company_name 
    });
  
    // Function to log out the user
    const logOut = () => setUser({ isLoggedIn: false, id:0, name:'', email: '' ,role: 'role', company_id: -1});//, company_name: ''
  
    return (
      <UserContext.Provider value={{ user, logIn, logOut }}>
        {children}
      </UserContext.Provider>
    );
  };



