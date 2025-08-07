
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pressed, setPressed] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.getMyProfile();
                    setProfile(response.data);
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    if (loading || !profile) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    const getInitials = (name) => {
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#F3E5F5', '#E1BEE7']} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back-outline" size={28} color="#4A148C" />
                    </TouchableOpacity>
                    <Animatable.View animation="bounceIn" duration={1200} style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
                    </Animatable.View>
                    <Animatable.Text animation="fadeInUp" delay={200} style={styles.name}>{profile.name}</Animatable.Text>
                    <Animatable.Text animation="fadeInUp" delay={400} style={styles.email}>{profile.email}</Animatable.Text>
                </LinearGradient>

                <Animatable.View animation="fadeInUp" delay={600} style={styles.content}>
                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Membership Details</Text>
                        <InfoRow icon="id-card-outline" label="Member ID" value={`LIB-${profile.id}`} />
                        <InfoRow icon="shield-checkmark-outline" label="Status" value={profile.membershipActive ? 'Active' : 'Expired'} highlight={profile.membershipActive} />
                        <InfoRow icon="calendar-outline" label="Membership Due" value={profile.membershipDueDate ? new Date(profile.membershipDueDate).toLocaleDateString() : 'N/A'} />
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Contact Information</Text>
                        <InfoRow icon="call-outline" label="Phone Number" value={profile.phone} />
                    </View>
                    
                    <Animatable.View animation="pulse" iterationCount="infinite" delay={1000}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ChangePassword')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient colors={['#8E44AD', '#6A1B9A']} style={styles.actionButton}>
                                <Ionicons name="lock-closed-outline" size={22} color="#FFF" />
                                <Text style={styles.actionButtonText}>Change Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animatable.View>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const InfoRow = ({ icon, label, value, highlight }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={22} color="#AE8EC9" />
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, highlight !== undefined && { color: highlight ? '#2E7D32' : '#C62828', fontWeight: 'bold' }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FA' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', paddingVertical: 30, paddingBottom: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    backButton: { position: 'absolute', top: 50, left: 20 },
    avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: '#FFF' },
    avatarText: { fontSize: 44, fontWeight: 'bold', color: '#4A148C' },
    name: { fontSize: 26, fontWeight: 'bold', color: '#4A148C' },
    email: { fontSize: 16, color: '#6A1B9A', marginTop: 4 },
    content: { padding: 16, marginTop: -40 },
    infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A148C', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3E5F5', paddingBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    infoLabel: { fontSize: 16, color: '#6A1B9A', marginLeft: 15, flex: 1 },
    infoValue: { fontSize: 16, fontWeight: '600', color: '#4A148C' },
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 15, padding: 18, shadowColor: '#6A1B9A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    actionButtonText: { marginLeft: 12, fontSize: 16, fontWeight: 'bold', color: '#FFF' }
});

export default ProfileScreen;