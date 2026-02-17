import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { Message } from '../../store/chatStore';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { Feather } from '@expo/vector-icons';

export interface MessageBubbleProps {
    message: Message;
    isMine: boolean;
    onImagePress?: (url: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isMine,
    onImagePress,
}) => {
    const renderContent = () => {
        switch (message.message_type) {
            case 'image':
                return (
                    <TouchableOpacity onPress={() => onImagePress?.(message.media_url!)}>
                        <Image
                            source={{ uri: message.media_url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                );
            case 'video':
                return (
                    <View style={styles.mediaPlaceholder}>
                        <Feather name="play-circle" size={32} color={isMine ? theme.colors.white : theme.colors.primary[500]} />
                        <Text variant="xs" color={isMine ? theme.colors.white : theme.colors.gray[600]} style={styles.mediaText}>
                            Video Message
                        </Text>
                    </View>
                );
            case 'voice':
                return (
                    <View style={styles.voiceContainer}>
                        <Feather name="mic" size={18} color={isMine ? theme.colors.white : theme.colors.primary[500]} />
                        <View style={styles.voiceWave}>
                            {[...Array(10)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.waveBar,
                                        {
                                            height: 4 + Math.random() * 12,
                                            backgroundColor: isMine ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.1)'
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                        <Text variant="xs" color={isMine ? theme.colors.white : theme.colors.gray[600]}>0:12</Text>
                    </View>
                );
            default:
                return (
                    <Text
                        variant="base"
                        color={isMine ? theme.colors.white : theme.colors.gray[800]}
                        style={styles.text}
                    >
                        {message.content}
                    </Text>
                );
        }
    };

    return (
        <View style={[styles.container, isMine ? styles.mine : styles.theirs]}>
            <View
                style={[
                    styles.bubble,
                    isMine ? styles.bubbleMine : styles.bubbleTheirs,
                    message.message_type === 'image' && styles.imageBubble,
                ]}
            >
                {renderContent()}
                <View style={styles.footer}>
                    <Text
                        variant="xs"
                        color={isMine ? 'rgba(255,255,255,0.7)' : theme.colors.gray[400]}
                        style={styles.time}
                    >
                        {formatTime(message.created_at)}
                    </Text>
                    {isMine && (
                        <Feather
                            name={message.is_read ? 'check-circle' : 'check'}
                            size={12}
                            color={message.is_read ? theme.colors.success[300] : 'rgba(255,255,255,0.7)'}
                            style={styles.statusIcon}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 4,
        flexDirection: 'row',
    },
    mine: {
        justifyContent: 'flex-end',
    },
    theirs: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2.5],
        borderRadius: 20,
        ...theme.shadows.sm,
    },
    bubbleMine: {
        backgroundColor: theme.colors.primary[500],
        borderBottomRightRadius: 4,
    },
    bubbleTheirs: {
        backgroundColor: theme.colors.white,
        borderBottomLeftRadius: 4,
    },
    imageBubble: {
        padding: 0,
        overflow: 'hidden',
    },
    text: {
        lineHeight: 20,
    },
    image: {
        width: 240,
        height: 180,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    time: {
        fontSize: 10,
    },
    statusIcon: {
        marginLeft: 4,
    },
    mediaPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    mediaText: {
        marginLeft: 8,
    },
    voiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 150,
        paddingVertical: 4,
    },
    voiceWave: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 12,
    },
    waveBar: {
        width: 2,
        borderRadius: 1,
    },
    giftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    giftText: {
        marginLeft: 8,
    },
});
