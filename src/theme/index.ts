// Color Palette
export const colors = {
    // Primary Brand Colors
    primary: {
        50: '#FFF1F3',
        100: '#FFE4E8',
        200: '#FECDD6',
        300: '#FEA3B4',
        400: '#FC6D8D',
        500: '#F43F5E', // Main primary
        600: '#E11D48',
        700: '#BE123C',
        800: '#9F1239',
        900: '#881337',
    },

    // Secondary/Accent
    secondary: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0EA5E9', // Main secondary
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
    },

    // Success
    success: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E', // Main success
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
    },

    // Warning
    warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B', // Main warning
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
    },

    // Error/Danger
    error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444', // Main error
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
    },

    // Neutral/Gray
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Semantic Colors
    background: {
        light: '#FFFFFF',
        dark: '#0F172A',
    },
    text: {
        light: '#111827',
        dark: '#F9FAFB',
    },
    border: {
        light: '#E5E7EB',
        dark: '#374151',
    },

    // Special
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Online Status
    online: '#22C55E',
    offline: '#9CA3AF',
    away: '#F59E0B',

    // Premium
    premium: {
        gold: '#FFD700',
        gradient: ['#FFD700', '#FFA500'],
    },
};

// Typography
export const typography = {
    // Font Families
    fontFamily: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
    },

    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Line Heights
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font Weights
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },
};

// Spacing
export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
};

// Border Radius
export const borderRadius = {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
};

// Shadows
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
};

// Z-Index
export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
};

// Animation Durations
export const duration = {
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
};

// Breakpoints (for responsive design)
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

// Export theme object
export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    zIndex,
    duration,
    breakpoints,
};

export type Theme = typeof theme;
