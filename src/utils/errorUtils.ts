/**
 * Error Handling Utilities
 */

export class AppError extends Error {
    constructor(
        public message: string,
        public code?: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: any): string => {
    if (error instanceof AppError) {
        return error.message;
    }

    if (error?.message) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
    return (
        error?.message?.includes('network') ||
        error?.message?.includes('Network') ||
        error?.code === 'NETWORK_ERROR' ||
        !navigator.onLine
    );
};

export const getErrorMessage = (error: any): string => {
    // Supabase errors
    if (error?.error_description) {
        return error.error_description;
    }

    // API errors
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Firebase errors
    if (error?.code) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'User not found';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            default:
                return error.message || 'An error occurred';
        }
    }

    return handleError(error);
};

export const logError = (error: any, context?: string): void => {
    if (__DEV__) {
        console.error(`[${context || 'Error'}]:`, error);
    }

    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { tags: { context } });
};

export const createErrorHandler = (context: string) => {
    return (error: any) => {
        logError(error, context);
        return getErrorMessage(error);
    };
};

export const retry = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }

    throw lastError;
};

export const withErrorBoundary = async <T>(
    fn: () => Promise<T>,
    fallback?: T
): Promise<T | undefined> => {
    try {
        return await fn();
    } catch (error) {
        logError(error);
        return fallback;
    }
};

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandlers = (): void => {
    if (typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', (event) => {
            logError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault();
        });
    }
};
