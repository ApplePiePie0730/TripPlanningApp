import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function EventCard({ event, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            <Text style={styles.time}>
                {event.start_time?.slice(0, 5)} – {event.end_time?.slice(0, 5)}
            </Text>
            <Text style={styles.title}>{event.title}</Text>
            {event.location ? <Text style={styles.location}>{event.location}</Text> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC1DA',
        shadowColor: '#FF90BB',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
    },
    time: {
        fontSize: 12,
        color: '#FF90BB',
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3d2b35',
    },
    location: {
        fontSize: 13,
        color: '#8ACCD5',
        marginTop: 4,
        fontWeight: '500',
    },
});
