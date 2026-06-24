import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { showError } from '../components/ErrorToast';

export default function EventDetailScreen({ navigation, route }) {
    const { event } = route.params;
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('event_id', event.id)
                .order('uploaded_at');
            if (error) throw error;
            setTickets(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }, [event.id]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('AddEditEvent', { event })}>
                    <Text style={styles.editBtn}>Edit</Text>
                </TouchableOpacity>
            ),
        });
        fetchTickets();
    }, [navigation, event, fetchTickets]);

    const handleDelete = () => {
        Alert.alert('Delete Event', `Delete "${event.title}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await supabase.from('events').delete().eq('id', event.id);
                    if (error) {
                        showError(error.message);
                        return;
                    }
                    navigation.goBack();
                },
            },
        ]);
    };

    const openMap = () => {
        if (!event.location) return;
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(event.location)}`);
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

    if (loading) return <LoadingSpinner />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.row}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{event.date}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>
                    {event.start_time?.slice(0, 5)} – {event.end_time?.slice(0, 5)}
                </Text>
            </View>

            {event.location ? (
                <View style={styles.row}>
                    <Text style={styles.metaLabel}>Location</Text>
                    <TouchableOpacity onPress={openMap}>
                        <Text style={styles.link}>{event.location}</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {event.notes ? (
                <View style={styles.notesBox}>
                    <Text style={styles.notesLabel}>Notes</Text>
                    <Text style={styles.notes}>{event.notes}</Text>
                </View>
            ) : null}

            {tickets.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tickets</Text>
                    {tickets.map((ticket) => (
                        <TouchableOpacity
                            key={ticket.id}
                            style={styles.ticketRow}
                            onPress={() => openTicket(ticket)}
                        >
                            <Text style={styles.ticketName}>{ticket.file_name}</Text>
                            <Text style={styles.ticketOpen}>Open →</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Delete Event</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8E1' },
    content: { padding: 18, paddingBottom: 40 },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3d2b35',
        marginBottom: 18,
        letterSpacing: 0.2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: '#FCE4F0',
    },
    metaLabel: { fontSize: 14, color: '#FF90BB', fontWeight: '700' },
    metaValue: { fontSize: 14, color: '#3d2b35' },
    link: { fontSize: 14, color: '#8ACCD5', textDecorationLine: 'underline', fontWeight: '600' },
    notesBox: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#FCE4F0',
    },
    notesLabel: {
        fontSize: 12,
        color: '#FF90BB',
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    notes: { fontSize: 14, color: '#3d2b35', lineHeight: 22 },
    section: { marginTop: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#3d2b35', marginBottom: 10 },
    ticketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#FCE4F0',
    },
    ticketName: { fontSize: 14, color: '#3d2b35', flex: 1 },
    ticketOpen: { fontSize: 13, color: '#FF90BB', marginLeft: 8, fontWeight: '600' },
    editBtn: { color: '#FF90BB', fontSize: 16, fontWeight: '700', marginRight: 4 },
    deleteBtn: {
        marginTop: 32,
        backgroundColor: '#fee2e2',
        borderRadius: 22,
        padding: 15,
        alignItems: 'center',
    },
    deleteBtnText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
