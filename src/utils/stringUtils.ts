/**
 * String Manipulation Utilities
 */

export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
    return str
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
};

export const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }

    return phone;
};

export const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;

    const visibleChars = 2;
    const masked = username.substring(0, visibleChars) + '***';
    return `${masked}@${domain}`;
};

export const maskPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return phone;

    const lastFour = cleaned.slice(-4);
    return `***-***-${lastFour}`;
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
    if (count === 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
};

export const removeEmojis = (str: string): string => {
    return str.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '');
};

export const extractHashtags = (str: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return str.match(hashtagRegex) || [];
};

export const extractMentions = (str: string): string[] => {
    const mentionRegex = /@[\w]+/g;
    return str.match(mentionRegex) || [];
};

export const highlightText = (text: string, query: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

export const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
