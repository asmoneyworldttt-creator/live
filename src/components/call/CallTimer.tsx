import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { formatDuration } from '../../utils/dateUtils';

export interface CallTimerProps {
    startTime: number; // Date.now() timestamp
}

export const CallTimer: React.FC<CallTimerProps> = ({ startTime }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <View style={styles.container}>
            <Text variant="xl" weight="bold" color={theme.colors.white}>
                {formatDuration(seconds)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
});
