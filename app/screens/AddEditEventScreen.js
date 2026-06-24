import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../lib/supabase';
import { showError } from '../components/ErrorToast';

function parseTimeStr(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

function toDateStr(d) {
    return d.toISOString().split('T')[0];
}

function toTimeStr(d) {
    return d.toTimeString().slice(0, 5);
}

export default function AddEditEventScreen({ navigation, route }) {
    const existing = route.params?.event ?? null;

    const [title, setTitle] = useState(existing?.title ?? '');
    const [date, setDate] = useState(existing?.date ? new Date(existing.date) : new Date());
    const [startTime, setStartTime] = useState(
        existing?.start_time ? parseTimeStr(existing.start_time) : new Date()
    );
    const [endTime, setEndTime] = useState(
        existing?.end_time ? parseTimeStr(existing.end_time) : new Date()
    );
    const [location, setLocation] = useState(existing?.location ?? '');
    const [notes, setNotes] = useState(existing?.notes ?? '');
    const [needsTicket, setNeedsTicket] = useState(existing?.needs_ticket ?? false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            showError('Title is required');
            return;
        }
        setSaving(true);
        const payload = {
            title: title.trim(),
            date: toDateStr(date),
            start_time: toTimeStr(startTime),
            end_time: toTimeStr(endTime),
            location: location.trim(),
            notes: notes.trim(),
            needs_ticket: needsTicket,
        };

        try {
            const { error } = existing
                ? await supabase.from('events').update(payload).eq('id', existing.id)
                : await supabase.from('events').insert(payload);
            if (error) throw error;
            navigation.goBack();
        } catch (err) {
            showError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Title *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Lone Pine Koala Sanctuary"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.pickerBtnText}>{toDateStr(date)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        minimumDate={new Date()}
                        onChange={(_, d) => {
                            setShowDatePicker(false);
                            if (d) setDate(d);
                        }}
                    />
                )}

                <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowStartPicker(true)}>
                    <Text style={styles.pickerBtnText}>{toTimeStr(startTime)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={(_, t) => {
                            setShowStartPicker(false);
                            if (t) setStartTime(t);
                        }}
                    />
                )}

                <Text style={styles.label}>End Time</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowEndPicker(true)}>
                    <Text style={styles.pickerBtnText}>{toTimeStr(endTime)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={(_, t) => {
                            setShowEndPicker(false);
                            if (t) setEndTime(t);
                        }}
                    />
                )}

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g. South Bank, Brisbane"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any notes, contacts, or reminders..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <View style={styles.toggleRow}>
                    <Text style={styles.label}>Needs Ticket</Text>
                    <Switch
                        value={needsTicket}
                        onValueChange={setNeedsTicket}
                        trackColor={{ false: '#e2e8f0', true: '#FF90BB' }}
                        thumbColor="#fff"
                    />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Event'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8E1' },
    content: { padding: 18, paddingBottom: 40 },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF90BB',
        marginTop: 18,
        marginBottom: 7,
        letterSpacing: 0.3,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F2C8DA',
        padding: 13,
        fontSize: 15,
        color: '#3d2b35',
    },
    textArea: { height: 100 },
    pickerBtn: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F2C8DA',
        padding: 13,
    },
    pickerBtnText: { fontSize: 15, color: '#3d2b35' },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
    },
    saveBtn: {
        marginTop: 30,
        backgroundColor: '#FF90BB',
        borderRadius: 28,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#FF90BB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
