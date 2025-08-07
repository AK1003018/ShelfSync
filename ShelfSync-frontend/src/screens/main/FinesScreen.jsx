
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const FinesScreen = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const FINE_PER_DAY = 5;

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.getMyBorrowedBooks();
                    setBorrowedBooks(response.data);
                } catch (error) {
                    console.error("Failed to fetch borrowed books for fines:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    const overdueBooks = borrowedBooks.filter(item => !item.returnDate && new Date() > new Date(item.dueDate));

    const totalOutstandingFine = overdueBooks.reduce((total, item) => {
        const daysOverdue = Math.floor((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24));
        return total + (daysOverdue * FINE_PER_DAY);
    }, 0);

    const renderOverdueItem = ({ item, index }) => {
        const dueDate = new Date(item.dueDate);
        const daysOverdue = Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24));
        const currentFine = daysOverdue * FINE_PER_DAY;

        return (
            <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.overdueItem}>
                <Ionicons name="alert-circle" size={24} color="#C62828" />
                <View style={styles.overdueInfo}>
                    <Text style={styles.overdueBookTitle}>{item.bookName}</Text>
                    <Text style={styles.overdueDetails}>Due: {dueDate.toLocaleDateString()} ({daysOverdue} days overdue)</Text>
                </View>
                <Text style={styles.overdueFine}>₹{currentFine}</Text>
            </Animatable.View>
        );
    };

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>My Fines</Text>
                <Text style={styles.pageSubtitle}>Manage pending fine payments</Text>
            </View>

            <Animatable.View animation="zoomIn">
                <LinearGradient colors={totalOutstandingFine > 0 ? ['#F8BBD0', '#F06292'] : ['#C8E6C9', '#81C784']} style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Total Outstanding Fine</Text>
                    <Text style={styles.statusAmount}>₹{totalOutstandingFine}</Text>
                    <Text style={styles.statusMessage}>{totalOutstandingFine > 0 ? "Please return overdue books to settle fines." : "You have no outstanding fines. Well done!"}</Text>
                </LinearGradient>
            </Animatable.View>

            {overdueBooks.length > 0 && (
                <View style={styles.finesSection}>
                    <Text style={styles.sectionTitle}>Overdue Books ({overdueBooks.length})</Text>
                    <FlatList data={overdueBooks} renderItem={renderOverdueItem} keyExtractor={item => item.id.toString()} scrollEnabled={false} />
                </View>
            )}

            <View style={styles.tipsSection}>
                <Ionicons name="information-circle-outline" size={24} color="#6A1B9A" />
                <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={styles.tipsTitle}>How Fines Work</Text>
                    <Text style={styles.tipContent}>• <Text style={{ fontWeight: 'bold' }}>Fine Rate:</Text> ₹{FINE_PER_DAY} per book, per day after the due date.</Text>
                    <Text style={styles.tipContent}>• <Text style={{ fontWeight: 'bold' }}>Payment:</Text> Fines are calculated and must be paid upon book return.</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    pageHeader: { padding: 16, paddingBottom: 0 },
    pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#4A148C' },
    pageSubtitle: { fontSize: 16, color: '#6A1B9A', marginTop: 4 },
    statusCard: { margin: 16, padding: 25, borderRadius: 20, alignItems: 'center' },
    statusLabel: { fontSize: 16, color: '#FFF', textTransform: 'uppercase', opacity: 0.8 },
    statusAmount: { fontSize: 48, fontWeight: 'bold', marginVertical: 8, color: '#FFF' },
    statusMessage: { fontSize: 14, color: '#FFF', opacity: 0.9, textAlign: 'center' },
    finesSection: { backgroundColor: '#fff', margin: 16, borderRadius: 15, padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A148C', marginBottom: 10 },
    overdueItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3E5F5' },
    overdueInfo: { flex: 1, marginHorizontal: 12 },
    overdueBookTitle: { fontSize: 16, fontWeight: '500', color: '#4A148C' },
    overdueDetails: { fontSize: 14, color: '#C62828', marginTop: 4 },
    overdueFine: { fontSize: 16, fontWeight: 'bold', color: '#C62828' },
    tipsSection: { backgroundColor: '#fff', flexDirection: 'row', margin: 16, padding: 20, borderRadius: 15 },
    tipsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#4A148C' },
    tipContent: { fontSize: 14, color: '#6A1B9A', marginBottom: 8, lineHeight: 20 },
});

export default FinesScreen;