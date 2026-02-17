import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import { Switch } from '../common/Switch';
import { Chip } from '../common/Chip';

export interface FilterPanelProps {
    initialFilters: {
        minAge: number;
        maxAge: number;
        maxDistance: number;
        gender?: 'male' | 'female' | 'other';
        verifiedOnly: boolean;
        onlineOnly: boolean;
    };
    onApply: (filters: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ initialFilters, onApply }) => {
    const [filters, setFilters] = useState(initialFilters);

    const toggleGender = (gender: 'male' | 'female' | 'other') => {
        setFilters(prev => ({
            ...prev,
            gender: prev.gender === gender ? undefined : gender
        }));
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text variant="lg" weight="bold" style={styles.sectionTitle}>Show Me</Text>
                <View style={styles.row}>
                    <Chip
                        label="Male"
                        active={filters.gender === 'male'}
                        onPress={() => toggleGender('male')}
                    />
                    <Chip
                        label="Female"
                        active={filters.gender === 'female'}
                        onPress={() => toggleGender('female')}
                    />
                    <Chip
                        label="Other"
                        active={filters.gender === 'other'}
                        onPress={() => toggleGender('other')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <Text variant="lg" weight="bold">Age Range</Text>
                    <Text weight="semibold" color={theme.colors.primary[500]}>
                        {filters.minAge} - {filters.maxAge}
                    </Text>
                </View>
                {/* Simplified range display - Real Slider would be better but requires extra dep */}
                <View style={styles.placeholderRange}>
                    <View style={styles.rangeBar} />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <Text variant="lg" weight="bold">Max Distance</Text>
                    <Text weight="semibold" color={theme.colors.primary[500]}>
                        {filters.maxDistance} km
                    </Text>
                </View>
                <View style={styles.placeholderRange}>
                    <View style={styles.rangeBar} />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <View>
                        <Text variant="lg" weight="bold">Verified Users Only</Text>
                        <Text variant="sm" color={theme.colors.gray[500]}>Only show profiles with a blue badge</Text>
                    </View>
                    <Switch
                        value={filters.verifiedOnly}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, verifiedOnly: val }))}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <View>
                        <Text variant="lg" weight="bold">Online Now</Text>
                        <Text variant="sm" color={theme.colors.gray[500]}>Only show users who are currently active</Text>
                    </View>
                    <Switch
                        value={filters.onlineOnly}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, onlineOnly: val }))}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Apply Filters"
                    onPress={() => onApply(filters)}
                    style={styles.applyButton}
                />
                <Button
                    title="Reset"
                    variant="ghost"
                    onPress={() => setFilters(initialFilters)}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing[4],
    },
    section: {
        marginBottom: theme.spacing[8],
    },
    sectionTitle: {
        marginBottom: theme.spacing[4],
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholderRange: {
        height: 40,
        justifyContent: 'center',
    },
    rangeBar: {
        height: 6,
        backgroundColor: theme.colors.primary[100],
        borderRadius: 3,
    },
    footer: {
        marginTop: theme.spacing[4],
        marginBottom: theme.spacing[10],
    },
    applyButton: {
        marginBottom: theme.spacing[3],
    },
});
