import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    Platform,
} from 'react-native';
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
        ? (() => {
              const [y, mo, d] = selected.split('-').map(Number);
              return new Date(y, mo - 1, d);
          })()
        : new Date();

    return (
        <>
            <View style={styles.row}>
                {days &&
                    days.map((day) => {
                        const [, month, dayNum] = day.value.split('-').map(Number);
                        const isActive = selected === day.value;
                        return (
                            <TouchableOpacity
                                key={day.value}
                                style={[
                                    styles.tab,
                                    { width: tabSize, height: tabSize },
                                    isActive && styles.activeTab,
                                ]}
                                onPress={() => onSelect(day.value)}
                            >
                                <Text style={[styles.month, isActive && styles.activeText]}>
                                    {MONTHS[month - 1]}
                                </Text>
                                <Text style={[styles.dayNum, isActive && styles.activeText]}>
                                    {dayNum}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                <TouchableOpacity
                    style={[styles.calBtn, { width: CAL_SIZE, height: tabSize }]}
                    onPress={() => setShowPicker(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color="#FF90BB" />
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
        paddingTop: 14,
        paddingBottom: 14,
        gap: GAP,
        alignItems: 'center',
    },
    tab: {
        borderRadius: 16,
        backgroundColor: '#FCE4F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#FF90BB',
        shadowColor: '#FF90BB',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 5,
    },
    calBtn: {
        borderRadius: 16,
        backgroundColor: '#FFC1DA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    month: {
        fontSize: 11,
        fontWeight: '600',
        color: '#C4A0B0',
    },
    dayNum: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3d2b35',
        marginTop: 1,
    },
    activeText: {
        color: '#fff',
    },
});
