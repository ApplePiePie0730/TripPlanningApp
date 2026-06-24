import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import DaySelector from '../components/DaySelector';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { showError } from '../components/ErrorToast';

function formatDateLabel(dateStr) {
    const [, month, day] = dateStr.split('-').map(Number);
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    return `${months[month - 1]} ${day}`;
}

export default function TimetableScreen({ navigation }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeDates, setActiveDates] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    // Ref so refreshDates can always read the latest selectedDate without stale closures
    const selectedDateRef = useRef(null);

    const fetchEvents = useCallback(async (date) => {
        if (!date) {
            setEvents([]);
            setLoading(false);
            setRefreshing(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('date', date)
                .order('start_time');
            if (error) throw error;
            setEvents(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Fetches all distinct event dates, keeps current selection if still valid,
    // otherwise falls back to the first available date.
    const refreshDates = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('events').select('date').order('date');
            if (error) throw error;
            const unique = [...new Set(data.map((r) => r.date))];
            const days = unique.slice(0, 5).map((d) => ({ label: formatDateLabel(d), value: d }));
            setActiveDates(days);

            const current = selectedDateRef.current;
            // Keep any selected date (including custom picker dates outside the 5 squares);
            // only fall back to the first available day when nothing is selected yet.
            const next = current ?? (days.length > 0 ? days[0].value : null);

            if (next !== current) {
                setSelectedDate(next);
                selectedDateRef.current = next;
            }
            return next;
        } catch (err) {
            showError(err.message);
            return selectedDateRef.current;
        }
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('AddEditEvent', {})}>
                    <Text style={styles.addBtn}>+ Add</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Focus fires on initial mount too, so this handles both initial load and
    // returning from AddEditEvent / EventDetail.
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setLoading(true);
            const nextDate = await refreshDates();
            await fetchEvents(nextDate);
        });
        return unsubscribe;
    }, [navigation, refreshDates, fetchEvents]);

    const handleDaySelect = (date) => {
        setSelectedDate(date);
        selectedDateRef.current = date;
        setLoading(true);
        fetchEvents(date);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const nextDate = await refreshDates();
        await fetchEvents(nextDate);
    };

    if (loading && !refreshing) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={
                    <DaySelector
                        days={activeDates}
                        selected={selectedDate}
                        onSelect={handleDaySelect}
                    />
                }
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onPress={() => navigation.navigate('EventDetail', { event: item })}
                    />
                )}
                ListEmptyComponent={
                    <EmptyState
                        message={
                            activeDates.length === 0
                                ? 'Add an event to get started'
                                : 'No events for this day'
                        }
                    />
                }
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={[styles.list, events.length === 0 && styles.emptyList]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8E1' },
    list: { paddingTop: 4, paddingBottom: 20 },
    emptyList: { flex: 1 },
    addBtn: { color: '#FF90BB', fontSize: 16, fontWeight: '700', marginRight: 4 },
});
