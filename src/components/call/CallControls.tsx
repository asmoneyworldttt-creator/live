import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface CallControlsProps {
    isMuted: boolean;
    isVideoEnabled: boolean;
    isSpeakerOn: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleSpeaker: () => void;
    onSwitchCamera: () => void;
    onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
    isMuted,
    isVideoEnabled,
    isSpeakerOn,
    onToggleMute,
    onToggleVideo,
    onToggleSpeaker,
    onSwitchCamera,
    onEndCall,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={onToggleSpeaker}
                    style={[styles.button, isSpeakerOn && styles.activeButton]}
                >
                    <Feather name={isSpeakerOn ? "volume-2" : "volume-x"} size={24} color={isSpeakerOn ? theme.colors.primary[500] : theme.colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onToggleVideo}
                    style={[styles.button, !isVideoEnabled && styles.inactiveButton]}
                >
                    <Feather name={isVideoEnabled ? "video" : "video-off"} size={24} color={theme.colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onToggleMute}
                    style={[styles.button, isMuted && styles.inactiveButton]}
                >
                    <Feather name={isMuted ? "mic-off" : "mic"} size={24} color={theme.colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSwitchCamera}
                    style={styles.button}
                >
                    <Feather name="refresh-cw" size={24} color={theme.colors.white} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={onEndCall}
                style={styles.endCallButton}
            >
                <Feather name="phone-off" size={28} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 30,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: theme.colors.white,
    },
    inactiveButton: {
        backgroundColor: theme.colors.error[500],
    },
    endCallButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.error[500],
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
});
