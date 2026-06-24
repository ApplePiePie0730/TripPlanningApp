import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { showError } from '../components/ErrorToast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateLabel(dateStr) {
  const [, month, day] = dateStr.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

export default function TicketsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, ticketsRes] = await Promise.all([
        supabase.from('events').select('*').eq('needs_ticket', true).order('date').order('start_time'),
        supabase.from('tickets').select('*').order('uploaded_at', { ascending: false }),
      ]);
      if (eventsRes.error) throw eventsRes.error;
      if (ticketsRes.error) throw ticketsRes.error;
      setEvents(eventsRes.data);
      setTickets(ticketsRes.data);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events;

  const ticketsForEvent = (eventId) => tickets.filter((t) => t.event_id === eventId);

  const handleUpload = async (eventId) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });
    if (result.canceled) return;

    const file = result.assets[0];
    setUploading(eventId);

    try {
      const ext = file.name.split('.').pop();
      const storagePath = `${eventId}/${Date.now()}.${ext}`;

      const bytes = await new File(file.uri).bytes();

      const { error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(storagePath, bytes, { contentType: file.mimeType });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('tickets').insert({
        event_id: eventId,
        file_name: file.name,
        file_url: storagePath,
        uploaded_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;

      await fetchData();
    } catch (err) {
      showError(err.message);
    } finally {
      setUploading(null);
    }
  };

  const openTicket = async (ticket) => {
    try {
      const { data, error } = await supabase.storage
        .from('tickets')
        .createSignedUrl(ticket.file_url, 3600);
      if (error) throw error;
      Linking.openURL(data.signedUrl);
    } catch (err) {
      showError(err.message);
    }
  };

  const deleteTicket = (ticket) => {
    Alert.alert('Delete Ticket', `Delete "${ticket.file_name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.storage.from('tickets').remove([ticket.file_url]);
            const { error } = await supabase.from('tickets').delete().eq('id', ticket.id);
            if (error) throw error;
            await fetchData();
          } catch (err) {
            showError(err.message);
          }
        },
      },
    ]);
  };

  const pickerValue = selectedDate
    ? (() => { const [y, mo, d] = selectedDate.split('-').map(Number); return new Date(y, mo - 1, d); })()
    : new Date();

  const dateFilterBar = (
    <View style={styles.filterBar}>
      {selectedDate ? (
        <TouchableOpacity style={styles.activeDateChip} onPress={() => setSelectedDate(null)}>
          <Ionicons name="calendar" size={14} color="#3b82f6" style={{ marginRight: 4 }} />
          <Text style={styles.activeDateText}>{formatDateLabel(selectedDate)}</Text>
          <Ionicons name="close-circle" size={16} color="#3b82f6" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      ) : (
        <Text style={styles.allDatesText}>All dates</Text>
      )}
      <TouchableOpacity style={styles.calBtn} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={18} color="#3b82f6" />
        <Text style={styles.calBtnText}>Pick date</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, d) => {
            setShowPicker(false);
            if (d) setSelectedDate(toLocalDateStr(d));
          }}
        />
      )}
    </View>
  );

  if (loading) return <LoadingSpinner />;

  if (events.length === 0) {
    return <EmptyState message="Add some events first, then upload tickets here" />;
  }

  return (
    <FlatList
      data={filteredEvents}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={dateFilterBar}
      contentContainerStyle={[styles.list, filteredEvents.length === 0 && styles.emptyList]}
      ListEmptyComponent={
        <EmptyState message={selectedDate ? `No ticket events on ${formatDateLabel(selectedDate)}` : 'No ticket events found'} />
      }
      renderItem={({ item: event }) => {
        const eventTickets = ticketsForEvent(event.id);
        const isUploading = uploading === event.id;

        return (
          <View style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={styles.groupTitleWrap}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
              <TouchableOpacity
                style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]}
                onPress={() => handleUpload(event.id)}
                disabled={!!uploading}
              >
                <Text style={styles.uploadBtnText}>
                  {isUploading ? 'Uploading…' : '+ Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {eventTickets.length === 0 ? (
              <Text style={styles.noTickets}>No tickets yet</Text>
            ) : (
              eventTickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketRow}>
                  <TouchableOpacity style={styles.ticketNameWrap} onPress={() => openTicket(ticket)}>
                    <Text style={styles.ticketName}>{ticket.file_name}</Text>
                    <Text style={styles.ticketOpen}>Open →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTicket(ticket)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, paddingBottom: 40 },
  emptyList: { flex: 1 },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  allDatesText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  activeDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activeDateText: { fontSize: 14, color: '#3b82f6', fontWeight: '600' },
  calBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  calBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },
  group: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3, elevation: 2 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  groupTitleWrap: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  eventDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  uploadBtn: { backgroundColor: '#eff6ff', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 10 },
  uploadBtnDisabled: { opacity: 0.5 },
  uploadBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: '600' },
  noTickets: { fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' },
  ticketRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  ticketNameWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  ticketName: { fontSize: 13, color: '#334155', flex: 1 },
  ticketOpen: { fontSize: 12, color: '#3b82f6', marginLeft: 6 },
  deleteText: { fontSize: 13, color: '#dc2626', marginLeft: 10 },
});
