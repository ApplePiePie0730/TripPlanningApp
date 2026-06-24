import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const H_PAD = 12;
const GAP = 6;
const COLS = 5;
const CAL_SIZE = 42;

function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DaySelector({ days, selected, onSelect }) {
  const { width } = useWindowDimensions();
  const [showPicker, setShowPicker] = useState(false);

  // 5 tabs + 1 gap before the cal button
  const tabSize = Math.floor((width - H_PAD * 2 - GAP * COLS - CAL_SIZE) / COLS);

  const pickerValue = selected
    ? (() => { const [y, mo, d] = selected.split('-').map(Number); return new Date(y, mo - 1, d); })()
    : new Date();

  return (
    <>
      <View style={styles.row}>
        {days && days.map((day) => {
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
        <TouchableOpacity
          style={[styles.calBtn, { width: CAL_SIZE, height: tabSize }]}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, d) => {
            setShowPicker(false);
            if (d) onSelect(toLocalDateStr(d));
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 12,
    gap: GAP,
    alignItems: 'center',
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
  calBtn: {
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
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
