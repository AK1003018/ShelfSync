import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://{IP-addr}:5454/api';

const axiosInstance = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class API {
    login(credentials) { return axiosInstance.post('/auth/login', credentials); }
    register(userData) { return axiosInstance.post('/auth/register', userData); }
    getMemberDashboard() { return axiosInstance.get('/member/dashboard'); }
    getAllBooks() { return axiosInstance.get('/member/books/all'); }
    searchBooks(query) { return axiosInstance.get(`/member/books/search?query=${query}`); }
    getAvailableCopies(bookId) { return axiosInstance.get(`/member/books/${bookId}/copies`); }
    addToCart(copyId) { return axiosInstance.post(`/member/cart/add/${copyId}`); }
    viewCart() { return axiosInstance.get('/member/cart'); }
    removeFromCart(cartItemId) { return axiosInstance.delete(`/member/cart/remove/${cartItemId}`); }
    checkoutCart() { return axiosInstance.post('/member/cart/checkout'); }
    getMyProfile() { return axiosInstance.get('/member/me/profile'); }
    getMyBorrowedBooks() { return axiosInstance.get('/member/me/borrowed-books'); }
    getMyBorrowingHistory() { return axiosInstance.get('/member/me/borrowing-history'); }
    getMyPaymentHistory() { return axiosInstance.get('/member/me/payment-history'); }
    changeMyPassword(passwordData) { return axiosInstance.post('/member/me/change-password', passwordData); }
}

const api = new API();
export default api;



