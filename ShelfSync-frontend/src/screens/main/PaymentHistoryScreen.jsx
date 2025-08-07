
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const PaymentHistoryScreen = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.getMyPaymentHistory();
                    setPayments(response.data);
                } catch (error) {
                    console.error("Failed to fetch payment history:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    const PaymentItem = ({ item, index }) => {
        const isMembership = item.type === 'MEMBERSHIP';
        return (
            <Animatable.View animation="fadeInUp" duration={500} delay={index * 100} style={styles.paymentItem}>
                <View style={[styles.iconContainer, { backgroundColor: isMembership ? '#E3F2FD' : '#FFEBEE' }]}>
                    <Ionicons name={isMembership ? "id-card-outline" : "receipt-outline"} size={24} color={isMembership ? "#1E88E5" : "#C62828"} />
                </View>
                <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>{isMembership ? 'Membership Fee' : 'Late Return Fine'}</Text>
                    <Text style={styles.paymentDate}>{new Date(item.transactionTime).toLocaleString()}</Text>
                </View>
                <View style={styles.paymentAmountContainer}>
                    <Text style={styles.amountValue}>₹{item.amount}</Text>
                </View>
            </Animatable.View>
        );
    };

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={payments}
                renderItem={PaymentItem}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Payment History</Text>
                        <Text style={styles.pageSubtitle}>Track all your fees and payments</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="wallet-outline" size={60} color="#CE93D8" />
                        <Text style={styles.emptyText}>No payment history to display.</Text>
                    </View>
                }
                contentContainerStyle={styles.mainContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F6FA' },
    mainContent: { padding: 16, paddingBottom: 30 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    pageHeader: { marginBottom: 16 },
    pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#4A148C' },
    pageSubtitle: { fontSize: 16, color: '#6A1B9A' },
    paymentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
    iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    paymentInfo: { flex: 1 },
    paymentTitle: { fontSize: 16, fontWeight: '600', color: '#4A148C' },
    paymentDate: { color: '#6A1B9A', fontSize: 14, marginTop: 4 },
    paymentAmountContainer: { alignItems: 'flex-end' },
    amountValue: { fontSize: 20, fontWeight: 'bold', color: '#4A148C' },
    emptyContainer: { padding: 40, alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#6A1B9A', fontStyle: 'italic', marginTop: 15 },
});

export default PaymentHistoryScreen;