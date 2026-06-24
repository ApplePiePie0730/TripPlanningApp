import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import DaySelector from '../components/DaySelector';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { showError } from '../components/ErrorToast';

export default function TimetableScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('2026-07-30');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(
    async (date) => {
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
    },
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddEditEvent', {})}>
          <Text style={styles.addBtn}>+ Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    fetchEvents(selectedDate);
  }, [selectedDate, fetchEvents]);

  // Re-fetch when returning from add/edit/delete
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents(selectedDate);
    });
    return unsubscribe;
  }, [navigation, selectedDate, fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(selectedDate);
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    setLoading(true);
  };

  if (loading && !refreshing) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <DaySelector selected={selectedDate} onSelect={handleDaySelect} />
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          />
        )}
        ListEmptyComponent={<EmptyState message="No events for this day" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={[styles.list, events.length === 0 && styles.emptyList]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { paddingTop: 8, paddingBottom: 20 },
  emptyList: { flex: 1 },
  addBtn: { color: '#3b82f6', fontSize: 16, fontWeight: '600', marginRight: 4 },
});
