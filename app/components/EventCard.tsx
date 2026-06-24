import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
}

export default function EventCard({ title, startTime, endTime, location }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.time}>
        {startTime} – {endTime}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f4f8',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});
