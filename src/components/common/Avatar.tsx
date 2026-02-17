import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export interface AvatarProps {
    source?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
    name?: string;
    onPress?: () => void;
    showStatus?: boolean;
    isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
    source,
    size = 'md',
    name,
    onPress,
    showStatus = false,
    isOnline = false,
}) => {
    const getSize = () => {
        if (typeof size === 'number') return size;
        switch (size) {
            case 'sm': return 32;
            case 'md': return 48;
            case 'lg': return 64;
            case 'xl': return 96;
            default: return 48;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return 'xs';
            case 'md': return 'lg';
            case 'lg': return 'xl';
            case 'xl': return '3xl';
            default: return 'lg';
        }
    };

    const dimension = getSize();
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    const Content = () => (
        <View style={[styles.container, { width: dimension, height: dimension }]}>
            {source ? (
                <Image
                    source={{ uri: source }}
                    style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.placeholder, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}>
                    <Text
                        variant={getFontSize()}
                        weight="bold"
                        color={theme.colors.primary[500]}
                    >
                        {initials}
                    </Text>
                </View>
            )}

            {showStatus && (
                <View style={[
                    styles.status,
                    {
                        backgroundColor: isOnline ? theme.colors.success[500] : theme.colors.gray[400],
                        width: dimension * 0.25,
                        height: dimension * 0.25,
                        borderRadius: dimension * 0.125,
                        bottom: 0,
                        right: 0,
                    }
                ]} />
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
        position: 'relative',
    },
    image: {
        backgroundColor: theme.colors.gray[200],
    },
    placeholder: {
        backgroundColor: theme.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary[100],
    },
    status: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
});
