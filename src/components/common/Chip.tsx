import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface ChipProps {
    label: string;
    onPress?: () => void;
    onDelete?: () => void;
    active?: boolean;
    variant?: 'primary' | 'secondary' | 'gray';
    icon?: keyof typeof Feather.glyphMap;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    onPress,
    onDelete,
    active = false,
    variant = 'gray',
    icon,
}) => {
    const getColors = () => {
        if (active) {
            return {
                bg: theme.colors.primary[500],
                text: theme.colors.white,
                icon: theme.colors.white,
            };
        }
        switch (variant) {
            case 'primary': return { bg: theme.colors.primary[50], text: theme.colors.primary[600], icon: theme.colors.primary[500] };
            case 'secondary': return { bg: theme.colors.secondary[50], text: theme.colors.secondary[600], icon: theme.colors.secondary[500] };
            default: return { bg: theme.colors.gray[100], text: theme.colors.gray[700], icon: theme.colors.gray[500] };
        }
    };

    const colors = getColors();

    const Content = () => (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            {icon && (
                <Feather name={icon} size={14} color={colors.icon} style={styles.icon} />
            )}
            <Text variant="xs" weight="medium" color={colors.text}>
                {label}
            </Text>
            {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Feather name="x" size={14} color={colors.text} />
                </TouchableOpacity>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Content />
            </TouchableOpacity>
        );
    }

    return <Content />;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing[1.5],
        paddingHorizontal: theme.spacing[3],
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing[2],
        marginBottom: theme.spacing[2],
    },
    icon: {
        marginRight: 4,
    },
    deleteButton: {
        marginLeft: 4,
    },
});
