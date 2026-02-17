import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export interface Tab {
    id: string;
    label: string;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    scrollable?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    scrollable = false,
}) => {
    const renderTabs = () => (
        tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => onTabChange(tab.id)}
                    style={[
                        styles.tab,
                        isActive && styles.activeTab,
                        !scrollable && { flex: 1 },
                    ]}
                >
                    <Text
                        variant="sm"
                        weight={isActive ? 'semibold' : 'medium'}
                        color={isActive ? theme.colors.primary[500] : theme.colors.gray[500]}
                        style={styles.tabText}
                    >
                        {tab.label}
                    </Text>
                    {isActive && <View style={styles.indicator} />}
                </TouchableOpacity>
            );
        })
    );

    if (scrollable) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {renderTabs()}
            </ScrollView>
        );
    }

    return <View style={styles.container}>{renderTabs()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[200],
    },
    scrollContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[200],
    },
    scrollContent: {
        paddingHorizontal: theme.spacing[4],
    },
    tab: {
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeTab: {
        // Optional active styling
    },
    tabText: {
        textAlign: 'center',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: theme.spacing[4],
        right: theme.spacing[4],
        height: 3,
        backgroundColor: theme.colors.primary[500],
        borderTopLeftRadius: theme.borderRadius.full,
        borderTopRightRadius: theme.borderRadius.full,
    },
});
