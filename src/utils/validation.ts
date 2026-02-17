/**
 * Validation Utilities
 */

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's 10-15 digits
    return cleaned.length >= 10 && cleaned.length <= 15;
};

export const isValidPassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidAge = (dateOfBirth: string, minAge: number = 18): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= minAge;
};

export const isValidUsername = (username: string): boolean => {
    // 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const sanitizeInput = (input: string): string => {
    // Remove potentially harmful characters
    return input
        .replace(/[<>]/g, '')
        .trim();
};

export const validateRequired = (value: any): boolean => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
};

export const validateRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};
