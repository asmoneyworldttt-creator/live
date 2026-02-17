import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export interface ProgressBarProps {
    progress: number; // 0 to 1
    color?: string;
    backgroundColor?: string;
    height?: number;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = theme.colors.primary[500],
    backgroundColor = theme.colors.gray[100],
    height = 6,
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View style={[styles.container, { backgroundColor, height, borderRadius: height / 2 }]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${clampedProgress * 100}%`,
                        backgroundColor: color,
                        height,
                        borderRadius: height / 2,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        // Optional fill styling
    },
});
