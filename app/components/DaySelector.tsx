import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DAYS = [
  { label: 'Jul 30', value: '2026-07-30' },
  { label: 'Jul 31', value: '2026-07-31' },
  { label: 'Aug 1', value: '2026-08-01' },
  { label: 'Aug 2', value: '2026-08-02' },
];

interface Props {
  selected: string;
  onSelect: (date: string) => void;
}

export default function DaySelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  label: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
  },
});
