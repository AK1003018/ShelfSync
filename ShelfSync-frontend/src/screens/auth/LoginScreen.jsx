import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    
    // State for password visibility
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Load custom font
    const [fontsLoaded] = useFonts({
        'GreatVibes-Regular': require('../../../assets/fonts/GreatVibes-Regular.ttf'),
    });

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        try {
            setLoading(true);
            const response = await api.login({ email, password });
            if (response.data.token) {
                await login(response.data.token);
            } else {
                 Alert.alert('Login Failed', 'Received an invalid response from the server.');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#F3E5F5', '#E1BEE7', '#CE93D8']} style={styles.gradient}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.container}>
                        
                        <Animatable.View animation="fadeInDown" duration={1500}>
                            <Text style={styles.logoText}>ShelfSync</Text>
                        </Animatable.View>

                        <Animatable.Text animation="fadeInUp" duration={1000} delay={500} style={styles.subtitle}>Welcome back, please sign in.</Animatable.Text>

                        <View style={styles.formContainer}>
                            <Animatable.View animation="fadeInUp" duration={1000} delay={800}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                                    <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Email Address" placeholderTextColor="#AE8EC9" />
                                </View>
                            </Animatable.View>

                            <Animatable.View animation="fadeInUp" duration={1000} delay={1000}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={22} color="#6A1B9A" style={styles.inputIcon} />
                                    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} placeholder="Password" placeholderTextColor="#AE8EC9" />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="#6A1B9A" />
                                    </TouchableOpacity>
                                </View>
                            </Animatable.View>

                            <Animatable.View animation="fadeInUp" duration={1000} delay={1200}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#FFF" style={{ marginVertical: 20 }} />
                                ) : (
                                    <TouchableOpacity onPress={handleLogin}>
                                        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" duration={2000} style={styles.btnWrapper}>
                                            <LinearGradient colors={['#8E44AD', '#6A1B9A']} style={styles.btn}>
                                                <Text style={styles.btnText}>Sign In</Text>
                                            </LinearGradient>
                                        </Animatable.View>
                                    </TouchableOpacity>
                                )}
                            </Animatable.View>
                        </View>
                        
                        <Animatable.View animation="fadeIn" duration={1000} delay={1500} style={styles.footer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.link}>Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text></Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3E5F5' },
    gradient: { flex: 1 },
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30 },
    logoText: {
        fontFamily: 'GreatVibes-Regular',
        fontSize: width * 0.2, // Responsive font size
        textAlign: 'center',
        color: '#4A148C',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 10,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#6A1B9A',
        marginBottom: 40,
        fontWeight: '300',
    },
    formContainer: { marginBottom: 30 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 18, fontSize: 16, color: '#4A148C' },
    btnWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    btn: { padding: 20, borderRadius: 15, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    footer: { alignItems: 'center', marginTop: 20 },
    link: { color: '#6A1B9A', fontSize: 16, textAlign: 'center' },
});

export default LoginScreen;




