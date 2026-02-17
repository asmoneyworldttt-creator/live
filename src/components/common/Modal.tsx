import React from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Text } from './Text';
import { Feather } from '@expo/vector-icons';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    fullScreen = false
}) => {
    return (
        <RNModal
            visible={visible}
            transparent={!fullScreen}
            animationType={fullScreen ? 'slide' : 'fade'}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={fullScreen ? styles.fullScreenContainer : styles.overlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={[
                            fullScreen ? styles.fullScreenContent : styles.content,
                            !fullScreen && theme.shadows.xl
                        ]}>
                            <View style={styles.header}>
                                <Text variant="lg" weight="bold">{title}</Text>
                                <TouchableWithoutFeedback onPress={onClose}>
                                    <View style={styles.closeButton}>
                                        <Feather name="x" size={24} color={theme.colors.gray[500]} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                style={{ flex: 1 }}
                            >
                                <ScrollView
                                    contentContainerStyle={styles.body}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {children}
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing[4],
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    fullScreenContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    closeButton: {
        padding: theme.spacing[2],
    },
    body: {
        padding: theme.spacing[4],
    },
});
