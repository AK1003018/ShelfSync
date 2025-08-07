
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const BookDetailsScreen = ({ route, navigation }) => {
    const { book } = route.params;
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        if (book.availableCopies === 0) {
            Alert.alert("Out of Stock", "There are no available copies of this book to borrow.");
            return;
        }

        setIsAddingToCart(true);
        try {
            const copiesResponse = await api.getAvailableCopies(book.id);
            if (!copiesResponse.data || copiesResponse.data.length === 0) {
                Alert.alert("Sorry!", "No copies were available at this moment. Someone might have just borrowed the last one.");
                navigation.goBack();
                return;
            }

            const firstAvailableCopy = copiesResponse.data[0];
            await api.addToCart(firstAvailableCopy.id);

            Alert.alert(
                "Success!",
                `Copy #${firstAvailableCopy.id} of "${book.name}" has been added to your cart.`,
                [
                    { text: "View Cart", onPress: () => navigation.navigate('Cart') },
                    { text: "OK", style: "cancel" }
                ]
            );
        } catch (error) {
            console.error("Add to cart process failed:", error.response?.data || error.message);
            Alert.alert("Error", "Could not add this book to your cart. Please try again.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Animatable.View animation="fadeIn" duration={600}>
                <View style={styles.bookHeader}>
                    <Text style={styles.bookTitle}>{book.name}</Text>
                    <Text style={styles.bookAuthor}>by {book.author}</Text>
                    <View style={[styles.availabilityBanner, book.availableCopies > 0 ? styles.availableBanner : styles.unavailableBanner]}>
                        <Text style={styles.availabilityText}>{book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available</Text>
                    </View>
                </View>

                <View style={styles.bookInfo}>
                    <Text style={styles.sectionTitle}>Book Information</Text>
                    <View style={styles.infoGrid}>
                        <InfoItem icon="barcode-outline" label="ISBN" value={book.isbn} />
                        <InfoItem icon="bookmarks-outline" label="Subject" value={book.subject} />
                        <InfoItem icon="cash-outline" label="Price" value={`₹${book.price}`} />
                        <InfoItem icon="library-outline" label="Total Copies" value={book.totalCopies} />
                    </View>
                </View>
            </Animatable.View>
            
            <Animatable.View animation="slideInUp" duration={800} style={styles.actionContainer}>
                <TouchableOpacity
                    onPress={handleAddToCart}
                    disabled={isAddingToCart || book.availableCopies === 0}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={isAddingToCart || book.availableCopies === 0 ? ['#D7BDE2', '#D2B4DE'] : ['#8E44AD', '#6A1B9A']}
                        style={styles.primaryButton}
                    >
                        {isAddingToCart ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="cart-outline" size={22} color="#FFF" />
                                <Text style={styles.buttonText}>Add Available Copy to Cart</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </Animatable.View>
        </ScrollView>
    );
};

// --- CORRECTED COMPONENT ---
// Uses flex-start for alignment and a slightly different structure for robustness
const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
        <Ionicons name={icon} size={22} color="#8E44AD" style={{ marginTop: 2 }} />
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    bookHeader: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, margin: 16, marginBottom: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
    bookTitle: { fontSize: 28, fontWeight: 'bold', color: '#4A148C', textAlign: 'center' },
    bookAuthor: { fontSize: 18, color: '#6A1B9A', fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
    availabilityBanner: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    availableBanner: { backgroundColor: '#E8F5E9' },
    unavailableBanner: { backgroundColor: '#FCE4EC' },
    availabilityText: { color: '#2E7D32', fontWeight: 'bold' },
    
    bookInfo: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginHorizontal: 16, marginTop: 8 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#4A148C', borderBottomWidth: 1, borderBottomColor: '#F3E5F5', paddingBottom: 10 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    
    // --- CORRECTED STYLES ---
    infoItem: { width: '50%', marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start' }, // Key change: alignItems set to flex-start
    infoTextContainer: { marginLeft: 12, flex: 1 },
    infoLabel: { fontSize: 13, color: '#6A1B9A', textTransform: 'uppercase', marginBottom: 3 },
    infoValue: { fontSize: 16, fontWeight: '600', color: '#4A148C', flexShrink: 1 },

    // --- POLISHED BUTTON STYLES ---
    actionContainer: { padding: 16, paddingTop: 24, },
    primaryButton: { paddingVertical: 18, borderRadius: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 12, shadowColor: '#6A1B9A', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default BookDetailsScreen;