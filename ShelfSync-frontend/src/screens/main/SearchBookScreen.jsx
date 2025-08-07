
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const BookItem = ({ item, navigation, index }) => {
    const hasCopies = item.availableCopies > 0;

    return (
        <Animatable.View animation="fadeInUp" duration={500} delay={index * 100}>
            <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate('BookDetails', { book: item })}>
                <View style={{flex: 1}}>
                    <Text style={styles.bookTitle}>{item.name}</Text>
                    <Text style={styles.bookAuthor}>by {item.author}</Text>
                    <Text style={styles.bookSubject}>Subject: {item.subject}</Text>
                </View>
                <View style={styles.availability}>
                    <View style={[styles.availabilityStatus, { backgroundColor: hasCopies ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Text style={[styles.availabilityText, { color: hasCopies ? '#2E7D32' : '#C62828' }]}>
                            {hasCopies ? `${item.availableCopies} available` : 'Unavailable'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#BEA5CA" />
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );
};

const SearchBookScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            const response = await api.getAllBooks();
            setBooks(response.data);
        } catch (error) {
            Alert.alert("Error", "Could not load the library's books.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchAllBooks();
            return;
        }
        try {
            setIsSearching(true);
            const response = await api.searchBooks(searchQuery);
            setBooks(response.data);
        } catch (error) {
            Alert.alert("Error", "Could not perform search.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.searchSection}>
                <View style={styles.searchForm}>
                    <Ionicons name="search-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search title, author, subject..."
                        placeholderTextColor="#9E9E9E"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#8E44AD" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={books}
                    renderItem={({ item, index }) => <BookItem item={item} navigation={navigation} index={index} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.container}
                    ListEmptyComponent={
                        <View style={styles.noResults}>
                            <Ionicons name="search-circle-outline" size={80} color="#CE93D8" />
                            <Text style={styles.noResultsTitle}>No Books Found</Text>
                            <Text style={styles.noResultsSubtitle}>Try a different search term.</Text>
                        </View>
                    }
                    ListFooterComponent={isSearching && <ActivityIndicator size="small" color="#8E44AD" style={{ marginVertical: 20 }} />}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F6FA' },
    container: { paddingHorizontal: 16, paddingBottom: 30 },
    searchSection: { backgroundColor: '#FFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3E5F5' },
    searchForm: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E5F5', borderRadius: 15, paddingHorizontal: 15 },
    inputIcon: { marginRight: 10 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#4A148C' },
    bookItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A148C', marginBottom: 4 },
    bookAuthor: { color: '#6A1B9A', fontStyle: 'italic', marginBottom: 8 },
    bookSubject: { fontSize: 13, color: '#8E8E93' },
    availability: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    availabilityStatus: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    availabilityText: { fontWeight: '600', fontSize: 12 },
    noResults: { padding: 40, alignItems: 'center', marginTop: 50 },
    noResultsTitle: { fontSize: 22, color: '#6A1B9A', fontWeight: 'bold', marginTop: 15 },
    noResultsSubtitle: { fontSize: 16, color: '#90769C', marginTop: 8 },
});

export default SearchBookScreen;