import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface LikeButtonsProps {
    onUndo?: () => void;
    onNope: () => void;
    onSuperLike?: () => void;
    onLike: () => void;
    onBoost?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export const LikeButtons: React.FC<LikeButtonsProps> = ({
    onUndo,
    onNope,
    onSuperLike,
    onLike,
    onBoost,
    size = 'md',
}) => {
    const getBaseSize = () => {
        switch (size) {
            case 'sm': return 40;
            case 'md': return 56;
            case 'lg': return 64;
            default: return 56;
        }
    };

    const baseSize = getBaseSize();

    return (
        <View style={styles.container}>
            {onUndo && (
                <TouchableOpacity onPress={onUndo} style={[styles.button, styles.undoButton, { width: baseSize * 0.7, height: baseSize * 0.7 }]}>
                    <Feather name="rotate-ccw" size={baseSize * 0.35} color={theme.colors.warning[500]} />
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onNope} style={[styles.button, styles.nopeButton, { width: baseSize, height: baseSize }]}>
                <Feather name="x" size={baseSize * 0.5} color={theme.colors.error[500]} />
            </TouchableOpacity>

            {onSuperLike && (
                <TouchableOpacity onPress={onSuperLike} style={[styles.button, styles.superLikeButton, { width: baseSize * 0.8, height: baseSize * 0.8 }]}>
                    <Feather name="star" size={baseSize * 0.4} color={theme.colors.secondary[500]} />
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onLike} style={[styles.button, styles.likeButton, { width: baseSize, height: baseSize }]}>
                <Feather name="heart" size={baseSize * 0.5} color={theme.colors.success[500]} />
            </TouchableOpacity>

            {onBoost && (
                <TouchableOpacity onPress={onBoost} style={[styles.button, styles.boostButton, { width: baseSize * 0.7, height: baseSize * 0.7 }]}>
                    <Feather name="zap" size={baseSize * 0.35} color={theme.colors.primary[500]} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: theme.spacing[4],
        width: '100%',
    },
    button: {
        borderRadius: 100,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    undoButton: {
        borderColor: theme.colors.warning[100],
        borderWidth: 1,
    },
    nopeButton: {
        borderColor: theme.colors.error[100],
        borderWidth: 1,
    },
    superLikeButton: {
        borderColor: theme.colors.secondary[100],
        borderWidth: 1,
    },
    likeButton: {
        borderColor: theme.colors.success[100],
        borderWidth: 1,
    },
    boostButton: {
        borderColor: theme.colors.primary[100],
        borderWidth: 1,
    },
});
