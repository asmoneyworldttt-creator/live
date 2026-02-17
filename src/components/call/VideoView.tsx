import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RtcSurfaceView, VideoCanvasMode, RenderModeType } from 'react-native-agora';
import { theme } from '../../theme';
import { Text } from '../common/Text';
import { Feather } from '@expo/vector-icons';

export interface VideoViewProps {
    uid: number;
    isRemote?: boolean;
    name?: string;
    isMuted?: boolean;
    isVideoDisabled?: boolean;
}

export const VideoView: React.FC<VideoViewProps> = ({
    uid,
    isRemote = false,
    name,
    isMuted = false,
    isVideoDisabled = false,
}) => {
    return (
        <View style={styles.container}>
            {isVideoDisabled ? (
                <View style={styles.placeholder}>
                    <View style={styles.avatarPlaceholder}>
                        <Feather name="user" size={48} color={theme.colors.gray[400]} />
                    </View>
                    <Text variant="sm" color={theme.colors.gray[500]} style={styles.statusText}>
                        Video Paused
                    </Text>
                </View>
            ) : (
                <RtcSurfaceView
                    style={styles.surface}
                    canvas={{
                        uid,
                        renderMode: RenderModeType.RenderModeHidden,
                    }}
                />
            )}

            <View style={styles.overlay}>
                <View style={styles.userInfo}>
                    <Text variant="xs" weight="bold" color={theme.colors.white} style={styles.name}>
                        {name || (isRemote ? 'Remote User' : 'You')}
                    </Text>
                    {isMuted && (
                        <View style={styles.muteIcon}>
                            <Feather name="mic-off" size={12} color={theme.colors.error[500]} />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray[900],
        borderRadius: 12,
        overflow: 'hidden',
    },
    surface: {
        flex: 1,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[800],
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.gray[700],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusText: {
        marginTop: 8,
    },
    overlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    name: {
        marginRight: 4,
    },
    muteIcon: {
        marginLeft: 4,
    },
});
