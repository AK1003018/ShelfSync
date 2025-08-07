// MEMBER
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Import all screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import SearchBookScreen from '../screens/main/SearchBookScreen';
import BookDetailsScreen from '../screens/main/BookDetailsScreen';
import BorrowedBooksScreen from '../screens/main/BorrowedBooksScreen';
import BorrowingHistoryScreen from '../screens/main/BorrowingHistoryScreen';
import FinesScreen from '../screens/main/FinesScreen';
import PaymentHistoryScreen from '../screens/main/PaymentHistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ChangePasswordScreen from '../screens/main/ChangePasswordScreen';
import CartScreen from '../screens/main/CartScreen';

const Stack = createNativeStackNavigator();

const HeaderButtons = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    return (
        <View style={headerStyles.container}>
            <TouchableOpacity style={headerStyles.iconButton} onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart-outline" size={26} color="#4A4A4A" />
            </TouchableOpacity>
            <TouchableOpacity style={headerStyles.iconButton} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle-outline" size={26} color="#4A4A4A" />
            </TouchableOpacity>
            <TouchableOpacity style={headerStyles.signOutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

// --- NAVIGATOR STRUCTURE ---
const MainStack = () => (
    <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
            animation: 'slide_from_right',
            headerStyle: { backgroundColor: '#F9F6FA', shadowOpacity: 0, elevation: 0 },
            headerTintColor: '#4A148C',
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
            headerBackTitleVisible: false,
        }}
    >
        {/* The navigator handles the Dashboard header */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={({ navigation }) => ({ title: 'ShelfSync', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        
        {/* Other screens with the default header */}
        <Stack.Screen name="Cart" component={CartScreen} options={({ navigation }) => ({ title: 'My Cart', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="SearchBook" component={SearchBookScreen} options={({ navigation }) => ({ title: 'Search Books', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={({ navigation }) => ({ title: 'Change Password', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={({ navigation }) => ({ title: 'Book Details', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="BorrowedBooks" component={BorrowedBooksScreen} options={({ navigation }) => ({ title: 'My Borrowed Books', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="BorrowingHistory" component={BorrowingHistoryScreen} options={({ navigation }) => ({ title: 'Borrowing History', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="Fines" component={FinesScreen} options={({ navigation }) => ({ title: 'My Fines', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={({ navigation }) => ({ title: 'Payment History', headerRight: () => <HeaderButtons navigation={navigation} /> })} />
    </Stack.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    const { userToken, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' }}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }
    return <NavigationContainer>{userToken ? <MainStack /> : <AuthStack />}</NavigationContainer>;
};

const headerStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', marginRight: 10, gap: 16 },
    iconButton: { padding: 6 },
    signOutButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#8E44AD', justifyContent: 'center', alignItems: 'center' },
});

export default AppNavigator;





