
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AvailableCopiesScreen = ({ route }) => {
    const { book } = route.params;
    const [copies, setCopies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.getAvailableCopies(book.id);
            setCopies(response.data);
        } catch (error) {
            Alert.alert("Error", "Could not fetch available copies for this book.");
            console.error("Fetch copies error:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [book.id])
    );

    const handleAddToCart = async (copyId) => {
        try {
            await api.addToCart(copyId);
            Alert.alert("Success", `Copy #${copyId} has been added to your cart!`);
            fetchData(); // Refresh the list
        } catch (error) {
            Alert.alert("Error", error.response?.data?.error || "Could not add this copy to the cart.");
        }
    };

    const renderCopyItem = ({ item }) => (
        <View style={styles.copyCard}>
            <View style={styles.copyHeader}>
                <Text style={styles.copyId}>Copy ID: #{item.id}</Text>
                <View style={styles.copyStatus}><Text style={styles.statusText}>{item.status}</Text></View>
            </View>
            <Text style={styles.detailValue}><Ionicons name="location-outline" size={16} /> Location: {item.rack}</Text>
            <TouchableOpacity onPress={() => handleAddToCart(item.id)}>
                <LinearGradient colors={['#8E44AD', '#6A1B9A']} style={styles.borrowButton}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                    <Ionicons name="cart-outline" size={20} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F3E5F5', '#FFF']} style={{ flex: 1 }}>
                <View style={styles.bookHeader}>
                    <Text style={styles.bookTitle}>{book.name}</Text>
                    <Text style={styles.bookAuthor}>by {book.author}</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#8E44AD" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={copies}
                        renderItem={renderCopyItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 16 }}
                        ListHeaderComponent={<Text style={styles.sectionTitle}>Select a Copy to Borrow</Text>}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="library-outline" size={60} color="#CE93D8" />
                                <Text style={styles.emptyText}>No copies are currently available for this book.</Text>
                            </View>
                        }
                    />
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    bookHeader: { backgroundColor: 'rgba(255,255,255,0.7)', padding: 20, margin: 16, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignItems: 'center' },
    bookTitle: { fontSize: 26, fontWeight: 'bold', color: '#4A148C', textAlign: 'center' },
    bookAuthor: { fontSize: 18, color: '#6A1B9A', fontStyle: 'italic', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#4A148C', paddingLeft: 8 },
    copyCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: '#F3E5F5' },
    copyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    copyId: { fontSize: 18, fontWeight: 'bold', color: '#6A1B9A' },
    copyStatus: { backgroundColor: '#E8F5E9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#2E7D32' },
    detailValue: { fontWeight: '500', marginBottom: 16, fontSize: 16, color: '#4A4A4A' },
    borrowButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    emptyContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
    emptyText: { textAlign: 'center', fontStyle: 'italic', color: '#6A1B9A', marginTop: 20, fontSize: 16 },
});

export default AvailableCopiesScreen;