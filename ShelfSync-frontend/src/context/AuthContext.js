import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    // an async function that the login/logout functions will wait for
    const setTokenAndState = async (token) => {
        if (token) {
            await AsyncStorage.setItem('userToken', token);
        } else {
            await AsyncStorage.removeItem('userToken');
        }
        setUserToken(token);
    };
    
    // login is async and waits for the token to be saved
    const login = async (token) => {
        setIsLoading(true);
        await setTokenAndState(token);
        setIsLoading(false);
    };

    // logout is async and waits for the token to be removed
    const logout = async () => {
        setIsLoading(true);
        await setTokenAndState(null);
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        } catch (e) {
            console.error('Error reading token from storage:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};



