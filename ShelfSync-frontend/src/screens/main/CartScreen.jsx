
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    
    // Refs for animating individual items
    const viewRefs = useRef([]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.viewCart();
            setCartItems(response.data);
        } catch (error) {
            Alert.alert("Error", "Could not load your cart.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCart();
        }, [])
    );

    const handleRemove = (itemToRemove) => {
        const { cartItemId } = itemToRemove;
        
        // Find the ref and animate it out
        const viewRef = viewRefs.current[cartItemId];
        if (viewRef) {
            viewRef.fadeOutRight(500).then(() => {
                // Remove from state after animation
                setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
                // Call API in the background
                api.removeFromCart(cartItemId).catch(err => {
                    Alert.alert("Error", "Could not sync removal with server.");
                    fetchCart(); // Re-fetch to fix state
                });
            });
        }
    };

    const handleCheckout = async () => {
        setCheckingOut(true);
        try {
            const response = await api.checkoutCart();
            Alert.alert("Checkout Successful", response.data.status, [{ text: "OK", onPress: () => navigation.navigate('Dashboard') }]);
        } catch (error) {
            Alert.alert("Checkout Failed", error.response?.data?.error || "An error occurred during checkout.");
        } finally {
            setCheckingOut(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <Animatable.View 
            animation="fadeInUp" 
            duration={500} 
            delay={index * 100}
            ref={ref => viewRefs.current[item.cartItemId] = ref}
        >
            <View style={styles.itemContainer}>
                <Ionicons name="book" size={28} color="#8E44AD" style={{ marginRight: 15 }} />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.bookName}</Text>
                    <Text style={styles.itemDetails}>Copy ID: #{item.copyId} | Rack: {item.rack}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
                    <Animatable.View animation="pulse" iterationCount="infinite" delay={2000 + index*500}>
                        <Ionicons name="trash-outline" size={24} color="#C62828" />
                    </Animatable.View>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );

    if (loading) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.cartItemId.toString()}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Animatable.View animation="bounceIn" duration={1000}>
                            <Ionicons name="cart-outline" size={80} color="#CE93D8" />
                        </Animatable.View>
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                        <Text style={styles.emptySubtitle}>Add books from the search screen to borrow.</Text>
                    </View>
                }
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            />
            {cartItems.length > 0 && (
                <Animatable.View animation="slideInUp" duration={800} style={styles.checkoutButtonContainer}>
                    <TouchableOpacity onPress={handleCheckout} disabled={checkingOut} activeOpacity={0.8}>
                        <LinearGradient colors={checkingOut ? ['#D7BDE2', '#D2B4DE'] : ['#8E44AD', '#6A1B9A']} style={styles.checkoutButton}>
                            {checkingOut ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
    itemInfo: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A148C' },
    itemDetails: { fontSize: 14, color: '#6A1B9A', marginTop: 4 },
    removeButton: { padding: 8 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: -50, paddingHorizontal: 20 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 22, fontWeight: 'bold', color: '#6A1B9A' },
    emptySubtitle: { fontSize: 16, color: '#90769C', marginTop: 8, textAlign: 'center' },
    checkoutButtonContainer: { marginHorizontal: 16, marginVertical: 10, shadowColor: '#6A1B9A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    checkoutButton: { padding: 18, borderRadius: 15, alignItems: 'center' },
    checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;