import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

export interface LoaderProps {
    size?: 'small' | 'large';
    color?: string;
    fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'small',
    color = theme.colors.primary[500],
    fullscreen = false,
}) => {
    if (fullscreen) {
        return (
            <View style={styles.fullscreen}>
                <ActivityIndicator size="large" color={color} />
            </View>
        );
    }

    return <ActivityIndicator size={size} color={color} />;
};

const styles = StyleSheet.create({
    fullscreen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.fixed,
    },
});
