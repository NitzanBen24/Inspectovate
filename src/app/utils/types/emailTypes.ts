

export interface EmailInfo {
    customer?: string;
    provider?: string;
    message?: string;
    receiver?: string;
    attachments? :any [];
}

export interface EmailResult {
    success: boolean;
    message: string;
    error?: unknown;
}