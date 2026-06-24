import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DAYS = [
  { label: 'Jul 30', value: '2026-07-30' },
  { label: 'Jul 31', value: '2026-07-31' },
  { label: 'Aug 1', value: '2026-08-01' },
  { label: 'Aug 2', value: '2026-08-02' },
];

export default function DaySelector({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {DAYS.map((day) => (
        <TouchableOpacity
          key={day.value}
          style={[styles.tab, selected === day.value && styles.activeTab]}
          onPress={() => onSelect(day.value)}
        >
          <Text style={[styles.label, selected === day.value && styles.activeLabel]}>
            {day.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  activeLabel: {
    color: '#fff',
  },
});
