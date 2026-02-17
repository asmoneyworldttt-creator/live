import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface RatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    color?: string;
    onPress?: (rating: number) => void;
    readonly?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
    rating,
    maxRating = 5,
    size = 20,
    color = '#FFD700', // Gold
    onPress,
    readonly = false,
}) => {
    return (
        <View style={styles.container}>
            {[...Array(maxRating)].map((_, index) => {
                const starIndex = index + 1;
                const isFilled = starIndex <= Math.floor(rating);
                const isHalf = !isFilled && starIndex === Math.ceil(rating) && rating % 1 !== 0;

                return (
                    <TouchableOpacity
                        key={index}
                        disabled={readonly}
                        onPress={() => onPress?.(starIndex)}
                        activeOpacity={0.7}
                        style={styles.star}
                    >
                        <Feather
                            name={isFilled ? 'star' : isHalf ? 'star' : 'star'}
                            size={size}
                            color={isFilled || isHalf ? color : theme.colors.gray[300]}
                            style={isFilled ? styles.filled : null}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        marginRight: 2,
    },
    filled: {
        // Optional filled styling
    },
});
