import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ message = 'Nothing here yet' }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    text: {
        fontSize: 16,
        color: '#C4A0B0',
        fontWeight: '500',
    },
});
