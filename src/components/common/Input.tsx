import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof Feather.glyphMap;
    rightIcon?: keyof typeof Feather.glyphMap;
    onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && (
                <Text variant="sm" weight="medium" color={theme.colors.gray[700]} style={styles.label}>
                    {label}
                </Text>
            )}

            <View style={[
                styles.inputContainer,
                error ? styles.errorBorder : null,
                props.editable === false ? styles.disabled : null
            ]}>
                {leftIcon && (
                    <Feather
                        name={leftIcon}
                        size={20}
                        color={theme.colors.gray[400]}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? { paddingLeft: 40 } : null,
                        rightIcon ? { paddingRight: 40 } : null,
                        style
                    ]}
                    placeholderTextColor={theme.colors.gray[400]}
                    selectionColor={theme.colors.primary[500]}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                        style={styles.rightIcon}
                    >
                        <Feather
                            name={rightIcon}
                            size={20}
                            color={theme.colors.gray[400]}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text variant="xs" color={theme.colors.error[500]} style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing[4],
    },
    label: {
        marginBottom: theme.spacing[1],
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50],
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        borderRadius: theme.borderRadius.md,
        height: 48,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: theme.spacing[4],
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.gray[900],
    },
    leftIcon: {
        position: 'absolute',
        left: theme.spacing[3],
        zIndex: 1,
    },
    rightIcon: {
        position: 'absolute',
        right: theme.spacing[3],
        zIndex: 1,
    },
    errorBorder: {
        borderColor: theme.colors.error[500],
    },
    errorText: {
        marginTop: theme.spacing[1],
    },
    disabled: {
        backgroundColor: theme.colors.gray[100],
        opacity: 0.7,
    },
});
