import { AuthFail, AuthResponse } from "../types/apiTypes";


// utils/typeGuards.ts or a similar utility file
export const isAuthResponse = (data: AuthResponse | AuthFail): data is AuthResponse => {
    return (data as AuthResponse).user !== undefined;
  };
  