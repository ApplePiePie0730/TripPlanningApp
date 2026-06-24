import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const H_PAD = 12;
const GAP = 6;
const COLS = 5;

export default function DaySelector({ days, selected, onSelect }) {
  const { width } = useWindowDimensions();
  const tabSize = Math.floor((width - H_PAD * 2 - GAP * (COLS - 1)) / COLS);

  if (!days || days.length === 0) return null;

  return (
    <View style={styles.row}>
      {days.map((day) => {
        const [, month, dayNum] = day.value.split('-').map(Number);
        const isActive = selected === day.value;
        return (
          <TouchableOpacity
            key={day.value}
            style={[styles.tab, { width: tabSize, height: tabSize }, isActive && styles.activeTab]}
            onPress={() => onSelect(day.value)}
          >
            <Text style={[styles.month, isActive && styles.activeText]}>{MONTHS[month - 1]}</Text>
            <Text style={[styles.dayNum, isActive && styles.activeText]}>{dayNum}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 12,
    gap: GAP,
  },
  tab: {
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  month: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 1,
  },
  activeText: {
    color: '#fff',
  },
});
