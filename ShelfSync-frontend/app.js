import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

const App = () => {
    return (
        <AuthProvider>
            <AppNavigator />
            <StatusBar style="auto" />
        </AuthProvider>
    );
};

export default App;