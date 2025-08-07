
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ChangePasswordScreen = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setError('');
        if (!oldPassword || !newPassword || !confirmPassword) { setError('All fields are required.'); return; }
        if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; }
        if (newPassword.length < 6) { setError('New password must be at least 6 characters long.'); return; }
        
        setLoading(true);
        try {
            await api.changeMyPassword({ oldPassword, newPassword });
            Alert.alert("Success", "Your password has been updated successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred. Please check your current password.");
            console.error("Password change error:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Animatable.View animation="fadeInUp" duration={800} style={styles.changePasswordContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Secure Your Account</Text>
                            <Text style={styles.subtitle}>Choose a strong new password.</Text>
                        </View>
                        
                        {error ? (
                            <Animatable.View animation="shake" style={styles.errorMessageContainer}>
                                <Ionicons name="alert-circle-outline" size={20} color="#C62828" />
                                <Text style={styles.errorMessageText}>{error}</Text>
                            </Animatable.View>
                        ) : null}

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                            <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} placeholder="Current Password" placeholderTextColor="#9E9E9E"/>
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                            <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="New Password" placeholderTextColor="#9E9E9E"/>
                        </View>
                        <View style={styles.inputContainer}>
                             <Ionicons name="key-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                            <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm New Password" placeholderTextColor="#9E9E9E"/>
                        </View>

                        <TouchableOpacity onPress={handleUpdatePassword} disabled={loading}>
                            <LinearGradient colors={['#8E44AD', '#6A1B9A']} style={styles.btn}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Update Password</Text>}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
                            <Text style={styles.btnSecondaryText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F6FA' },
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    changePasswordContainer: { backgroundColor: '#fff', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    header: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#4A148C' },
    subtitle: { fontSize: 16, color: '#6A1B9A', marginTop: 4 },
    errorMessageContainer: { backgroundColor: '#FFEBEE', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 16, gap: 10 },
    errorMessageText: { color: '#C62828', flex: 1 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E5F5', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#4A148C' },
    btn: { padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 12 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    btnSecondary: { padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#CE93D8' },
    btnSecondaryText: { color: '#8E44AD', fontWeight: 'bold' }
});

export default ChangePasswordScreen;