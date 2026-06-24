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
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  time: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  location: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
});
