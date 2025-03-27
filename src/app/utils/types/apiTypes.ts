import { User } from "./entities";

export type QueryConfig<T> = {
    key: string;
    path: string;
    user?: User;
    options?: Record<string, any>;
};

export interface AuthResponse {
    message: string;
    user: User;
}

export interface AuthFail {
    error: string;
}


export interface apiPayload {
    message: string;
    success?: boolean;
    error?: unknown;
    data?: any;
}

