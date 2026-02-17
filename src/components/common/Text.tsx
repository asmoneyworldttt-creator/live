import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export interface TextProps extends RNTextProps {
    variant?: keyof typeof theme.typography.fontSize;
    weight?: keyof typeof theme.typography.fontWeight;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    size?: number;
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'base',
    weight = 'normal',
    color = theme.colors.text.light,
    align,
    size,
    style,
    ...props
}) => {
    const textStyle = {
        fontSize: size || theme.typography.fontSize[variant],
        fontWeight: theme.typography.fontWeight[weight] as any,
        color,
        textAlign: align,
        fontFamily: theme.typography.fontFamily[weight === 'bold' || weight === 'extrabold' ? 'bold' : 'regular'],
    };

    return (
        <RNText style={[styles.text, textStyle, style]} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    text: {
        includeFontPadding: false,
    },
});
