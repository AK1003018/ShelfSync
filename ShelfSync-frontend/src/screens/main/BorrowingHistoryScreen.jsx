
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const BorrowingHistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.getMyBorrowingHistory();
                    setHistory(response.data);
                } catch (error) {
                    console.error("Failed to fetch borrowing history:", error);
                    Alert.alert("Error", "Could not load borrowing history.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    const renderHistoryItem = ({ item, index }) => (
        <Animatable.View animation="fadeInUp" duration={500} delay={index * 100} style={styles.historyRow}>
            <View style={styles.bookInfo}>
                <Ionicons name="book" size={24} color="#8E44AD" style={{ marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.bookTitle}>{item.bookName}</Text>
                    <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
                </View>
                <View style={[styles.statusBadge, item.returnDate ? styles.statusReturned : styles.statusCurrent]}>
                    <Text style={styles.statusText}>{item.returnDate ? 'Returned' : 'Current'}</Text>
                </View>
            </View>
            <View style={styles.rowDetails}>
                <Text style={styles.dateCell}>Issued: {new Date(item.issueDate).toLocaleDateString()}</Text>
                <Text style={styles.dateCell}>Returned: {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '—'}</Text>
                <Text style={styles.fineAmount}>Fine Paid: ₹{item.fine || 0}</Text>
            </View>
        </Animatable.View>
    );

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    return (
        <FlatList
            style={styles.container}
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<View style={styles.pageHeader}><Text style={styles.pageTitle}>Borrowing History</Text><Text style={styles.pageSubtitle}>Your complete reading record</Text></View>}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="archive-outline" size={60} color="#CE93D8" />
                    <Text style={styles.emptyText}>Your borrowing history is empty.</Text>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    pageHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
    pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#4A148C' },
    pageSubtitle: { fontSize: 16, color: '#6A1B9A', marginTop: 4 },
    historyRow: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
    bookInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    bookTitle: { fontWeight: 'bold', fontSize: 16, color: '#4A148C' },
    bookAuthor: { fontSize: 14, color: '#6A1B9A', fontStyle: 'italic' },
    statusBadge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
    statusReturned: { backgroundColor: '#E8F5E9' },
    statusCurrent: { backgroundColor: '#E3F2FD' },
    statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    rowDetails: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: '#F3E5F5', paddingTop: 12 },
    dateCell: { fontSize: 13, color: '#6A1B9A' },
    fineAmount: { fontWeight: 'bold', color: '#4A148C' },
    emptyContainer: { padding: 40, alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#6A1B9A', fontStyle: 'italic', marginTop: 15 },
});

export default BorrowingHistoryScreen;