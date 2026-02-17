import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Chip } from '../common/Chip';
import { Text } from '../common/Text';

export interface InterestTagsProps {
    interests: string[];
    onAdd?: () => void;
    editable?: boolean;
}

export const InterestTags: React.FC<InterestTagsProps> = ({
    interests,
    onAdd,
    editable = false,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {interests.map((interest, index) => (
                    <Chip
                        key={index}
                        label={interest}
                        variant="primary"
                    />
                ))}
                {editable && (
                    <Chip
                        label="Add +"
                        onPress={onAdd}
                        variant="gray"
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
