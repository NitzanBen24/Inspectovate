

export interface EmailInfo {
    customer?: string;
    provider?: string;
    subject?: string;
    message?: string;
    receiver?: string;
    filename?: string;
    attachments? :any [];
}

export interface EmailResult {
    success: boolean;
    message: string;
    error?: unknown;
}