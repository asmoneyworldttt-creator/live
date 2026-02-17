import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onSendImage: (uri: string) => void;
    onSendVoice: (uri: string) => void;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    onSendImage,
    onSendVoice,
    onTypingStart,
    onTypingEnd,
}) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleTextChange = (text: string) => {
        setMessage(text);

        if (onTypingStart) {
            onTypingStart();
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                onTypingEnd?.();
            }, 2000);
        }
    };

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
            onTypingEnd?.();
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            onSendImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            onSendImage(result.assets[0].uri);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
                        <Feather name="plus" size={24} color={theme.colors.gray[500]} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.colors.gray[400]}
                        value={message}
                        onChangeText={handleTextChange}
                        multiline
                        maxLength={1000}
                    />

                    {message.length > 0 ? (
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                            <Feather name="send" size={20} color={theme.colors.white} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onLongPress={() => setIsRecording(true)}
                            onPressOut={() => setIsRecording(false)}
                            style={styles.voiceButton}
                        >
                            <Feather name="mic" size={20} color={isRecording ? theme.colors.error[500] : theme.colors.gray[500]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing[3],
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50],
        borderRadius: 24,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minHeight: 48,
    },
    actionButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        maxHeight: 120,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        color: theme.colors.gray[900],
    },
    sendButton: {
        backgroundColor: theme.colors.primary[500],
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    voiceButton: {
        padding: 8,
    },
});
