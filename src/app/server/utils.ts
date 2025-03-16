

export const handleError = (message: string, details?: unknown) => {
    console.error(message, details);
    return { success: false, error: message };
};
