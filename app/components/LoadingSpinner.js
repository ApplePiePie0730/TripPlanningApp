import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingSpinner() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF90BB" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
