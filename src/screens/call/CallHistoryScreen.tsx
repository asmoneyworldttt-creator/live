import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Loader } from '../../components/common';
import { theme } from '../../theme';
import { supabase } from '../../api/supabase';
import { useAuth, useCall } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { formatDateTime, formatDuration } from '../../utils/dateUtils';

interface CallRecord {
    id: string;
    channel_id: string;
    caller_id: string;
    receiver_id: string;
    call_type: 'audio' | 'video';
    status: 'ringing' | 'connected' | 'rejected' | 'ended';
    created_at: string;
    other_user_name?: string;
    other_user_avatar?: string;
}

export default function CallHistoryScreen({ navigation }: any) {
    const { profile } = useAuth();
    const { startCall } = useCall();
    const [calls, setCalls] = useState<CallRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCallHistory = async () => {
        if (!profile) return;
        setIsLoading(true);
        try {
            // Fetch calls where user is either caller or receiver
            const { data, error } = await supabase
                .from('call_signaling')
                .select(`
                    *,
                    caller:caller_id(id, full_name, avatar_url),
                    receiver:receiver_id(id, full_name, avatar_url)
                `)
                .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            // Map the data to include "other user" info easily
            const formattedCalls = data.map((call: any) => {
                const isCaller = call.caller_id === profile.id;
                const otherUser = isCaller ? call.receiver : call.caller;
                return {
                    ...call,
                    other_user_id: otherUser.id,
                    other_user_name: otherUser.full_name,
                    other_user_avatar: otherUser.avatar_url,
                    is_incoming: !isCaller
                };
            });

            setCalls(formattedCalls);
        } catch (error: any) {
            console.error('Error fetching call history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCallHistory();
    }, []);

    const handleRedial = async (record: any) => {
        try {
            const userToCall = {
                id: record.other_user_id,
                full_name: record.other_user_name,
                avatar_url: record.other_user_avatar
            };
            await startCall(userToCall, record.call_type);
            navigation.navigate('VideoCall');
        } catch (error: any) {
            Alert.alert('Call Failed', error.message);
        }
    };

    const renderCallItem = ({ item }: { item: any }) => (
        <View style={styles.callItem}>
            <TouchableOpacity
                style={styles.itemMain}
                onPress={() => navigation.navigate('OtherProfile', { userId: item.other_user_id, user: { id: item.other_user_id, full_name: item.other_user_name, avatar_url: item.other_user_avatar } })}
            >
                <Avatar
                    source={item.other_user_avatar}
                    name={item.other_user_name}
                    size="md"
                />
                <View style={styles.callInfo}>
                    <Text weight="bold" style={styles.name}>{item.other_user_name}</Text>
                    <View style={styles.statusRow}>
                        <Feather
                            name={item.is_incoming ? "arrow-down-left" : "arrow-up-right"}
                            size={14}
                            color={item.status === 'rejected' ? theme.colors.error[500] : theme.colors.success[500]}
                        />
                        <Text variant="xs" color={theme.colors.gray[500]} style={styles.statusText}>
                            {item.status.toUpperCase()} • {formatDateTime(item.created_at)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.redialBtn}
                onPress={() => handleRedial(item)}
            >
                <Feather
                    name={item.call_type === 'video' ? "video" : "phone"}
                    size={20}
                    color={theme.colors.primary[500]}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold">Call History</Text>
                    <TouchableOpacity onPress={fetchCallHistory} style={styles.historyButton}>
                        <Feather name="refresh-cw" size={20} color={theme.colors.gray[400]} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {isLoading && calls.length === 0 ? (
                <Loader fullscreen />
            ) : (
                <FlatList
                    data={calls}
                    renderItem={renderCallItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchCallHistory} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconBox}>
                                <Feather name="phone-off" size={48} color={theme.colors.gray[200]} />
                            </View>
                            <Text variant="lg" weight="bold" color={theme.colors.gray[400]}>No calls yet</Text>
                            <Text color={theme.colors.gray[300]} style={styles.emptySub}>Your call history will appear here</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        height: 56,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    historyButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    listContent: {
        paddingVertical: theme.spacing[4],
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[50],
    },
    itemMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    callInfo: {
        marginLeft: theme.spacing[4],
    },
    name: {
        fontSize: 16,
        marginBottom: 2,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 4,
    },
    redialBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptySub: {
        marginTop: 8,
    },
});
