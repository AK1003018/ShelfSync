
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const BorrowedBooksScreen = ({ navigation }) => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.getMyBorrowedBooks();
                    setBorrowedBooks(response.data);
                } catch (error) {
                    console.error("Failed to fetch borrowed books:", error);
                    Alert.alert("Error", "Could not load your borrowed books.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    const renewBook = () => {
        Alert.alert("Renew Book", "This feature is not yet available. Please contact a librarian for renewals.");
    };

    const renderBookItem = ({ item, index }) => {
        const dueDate = new Date(item.dueDate);
        const today = new Date();
        const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        let status = 'good';
        if (daysRemaining < 0) status = 'danger';
        else if (daysRemaining <= 3) status = 'warning';

        const statusInfo = {
            good: { text: 'Good Standing', color: '#2E7D32', bg: '#E8F5E9' },
            warning: { text: 'Due Soon', color: '#F9A825', bg: '#FFFDE7' },
            danger: { text: 'Overdue', color: '#C62828', bg: '#FFEBEE' },
        };

        return (
            <Animatable.View animation="fadeInUp" duration={500} delay={index * 100} style={[styles.bookItem, { borderLeftColor: statusInfo[status].color }]}>
                <View style={styles.bookHeader}>
                    <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle}>{item.bookName}</Text>
                        <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
                    </View>
                    <View style={[styles.dueStatus, { backgroundColor: statusInfo[status].bg }]}><Text style={[styles.statusText, { color: statusInfo[status].color }]}>{statusInfo[status].text}</Text></View>
                </View>
                <View style={styles.bookDetails}>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Due Date</Text><Text style={styles.detailValue}>{dueDate.toLocaleDateString()}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Days Remaining</Text><Text style={[styles.detailValue, { color: statusInfo[status].color, fontWeight: 'bold' }]}>{daysRemaining >= 0 ? `${daysRemaining}` : `Overdue by ${Math.abs(daysRemaining)}`}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Copy ID</Text><Text style={styles.detailValue}>#{item.copyId}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Borrowed</Text><Text style={styles.detailValue}>{new Date(item.issueDate).toLocaleDateString()}</Text></View>
                </View>
                <View style={styles.bookActions}>
                    <TouchableOpacity style={styles.primaryButton} onPress={renewBook}><Text style={styles.buttonText}>Renew Book</Text></TouchableOpacity>
                </View>
            </Animatable.View>
        );
    };

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }
    
    return (
        <FlatList
            style={styles.container}
            data={borrowedBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<View style={styles.pageHeader}><Text style={styles.pageTitle}>My Borrowed Books</Text><Text style={styles.pageSubtitle}>Manage your current borrowed books and track return dates</Text></View>}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={60} color="#CE93D8" />
                    <Text style={styles.emptyText}>You haven't borrowed any books yet.</Text>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    pageHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#4A148C' },
    pageSubtitle: { fontSize: 16, color: '#6A1B9A', marginTop: 4 },
    emptyContainer: { padding: 40, alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#6A1B9A', fontStyle: 'italic', marginTop: 15 },
    bookItem: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, borderLeftWidth: 5 },
    bookHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    bookInfo: { flex: 1, marginRight: 8 },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A148C' },
    bookAuthor: { fontSize: 14, color: '#6A1B9A', fontStyle: 'italic' },
    dueStatus: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
    statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    bookDetails: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: '#F3E5F5', paddingTop: 12 },
    detailItem: { width: '50%', marginBottom: 12 },
    detailLabel: { fontSize: 12, color: '#6A1B9A', textTransform: 'uppercase' },
    detailValue: { fontSize: 16, fontWeight: '500', color: '#4A148C' },
    bookActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, borderTopWidth: 1, borderTopColor: '#F3E5F5', paddingTop: 12 },
    primaryButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#8E44AD', borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default BorrowedBooksScreen;