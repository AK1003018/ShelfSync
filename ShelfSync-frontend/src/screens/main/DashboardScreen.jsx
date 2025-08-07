
import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert, Dimensions, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// --- STATS CARD COMPONENT ---
const StatCard = ({ icon, label, value, color, delay }) => (
    <Animatable.View animation="zoomIn" duration={500} delay={delay} style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon} size={22} color="#FFF" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </Animatable.View>
);

const QuickActionButton = ({ item, index, navigation }) => {
    const viewRef = useRef(null);
    const onPressIn = () => viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0.95 } }, 150);
    const onPressOut = () => viewRef.current.animate({ 0: { scale: 0.95 }, 1: { scale: 1 } }, 150);

    return (
        <Animatable.View animation="zoomIn" duration={500} delay={800 + index * 100} style={styles.actionCardContainer}>
            <Pressable onPress={() => item.onPress(navigation)} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Animatable.View ref={viewRef} style={styles.actionCard}>
                    <Ionicons name={item.icon} size={32} color="#8E44AD" />
                    <Text style={styles.actionTitle}>{item.title}</Text>
                </Animatable.View>
            </Pressable>
        </Animatable.View>
    );
};

const DashboardScreen = ({ navigation }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect( React.useCallback(() => {
            const fetchData = async () => {
                !dashboardData && setLoading(true);
                try {
                    const response = await api.getMemberDashboard();
                    setDashboardData(response.data);
                } catch (error) { console.error("Failed to fetch dashboard data:", error.response?.data || error.message); Alert.alert("Error", "Could not load dashboard data."); } finally { setLoading(false); }
            };
            fetchData();
        }, [])
    );

    if (loading || !dashboardData) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#8E44AD" /></View>;
    }
    
    const chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [ { data: [2.00, 2.00, 2.00, 0.00, 1.00, 4.00], color: (opacity = 1) => `rgba(142, 68, 173, ${opacity})`, strokeWidth: 3 } ],
      legend: ["Books Read This Year"]
    };
    const chartConfig = { backgroundGradientFrom: "#FFFFFF", backgroundGradientTo: "#FFFFFF", decimalPlaces: 2, fillShadowGradientFrom: "#E1BEE7", fillShadowGradientFromOpacity: 0.6, fillShadowGradientTo: "#FFFFFF", fillShadowGradientToOpacity: 0.1, color: (opacity = 1) => `rgba(142, 68, 173, ${opacity})`, labelColor: (opacity = 1) => `rgba(106, 27, 154, ${opacity})`, propsForDots: { r: "5", strokeWidth: "2", stroke: "#8E44AD" }, propsForBackgroundLines: { strokeDasharray: "4 4", stroke: "#F3E5F5" } };
    const quickActions = [ { title: 'Search Books', icon: 'search-outline', onPress: (nav) => nav.navigate('SearchBook') }, { title: 'My Cart', icon: 'cart-outline', onPress: (nav) => nav.navigate('Cart') }, { title: 'Borrowed Books', icon: 'book-outline', onPress: (nav) => nav.navigate('BorrowedBooks') }, { title: 'Borrowing History', icon: 'time-outline', onPress: (nav) => nav.navigate('BorrowingHistory') }, { title: 'My Fines', icon: 'card-outline', onPress: (nav) => nav.navigate('Fines') }, { title: 'Payment History', icon: 'receipt-outline', onPress: (nav) => nav.navigate('PaymentHistory') }, ];

    return (
        <View style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                
                <Animatable.View animation="fadeInDown" duration={600} style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Hello, {dashboardData.memberName.split(' ')[0]}!</Text>
                    <Animatable.Text animation="tada" easing="ease-in-out" iterationCount="infinite" delay={1500} style={{fontSize: 28}}>👋</Animatable.Text>
                </Animatable.View>
                
                {/* --- STATS CARDS --- */}
                <View style={styles.statsContainer}>
                    <StatCard icon="library-outline" label="Borrowed" value={dashboardData.currentlyBorrowedCount} color="#5DADE2" delay={200} />
                    <StatCard icon="checkmark-done-outline" label="Total Read" value={dashboardData.totalBooksReadCount} color="#58D68D" delay={300} />
                    <StatCard icon="alert-circle-outline" label="Fines" value={`₹${dashboardData.outstandingFines}`} color="#EC7063" delay={400} />
                </View>

                <Animatable.View animation="fadeInUp" duration={600} delay={500} style={styles.chartWrapper}>
                     <LineChart data={chartData} width={screenWidth - 32} height={230} chartConfig={chartConfig} bezier style={styles.chart} withInnerLines withOuterLines={false} fromZero withShadow />
                </Animatable.View>
                
                <View style={styles.section}>
                    <Animatable.Text animation="fadeInUp" delay={700} style={styles.sectionTitle}>Quick Actions</Animatable.Text>
                    <FlatList data={quickActions} renderItem={({item, index}) => <QuickActionButton item={item} index={index} navigation={navigation} />} keyExtractor={item => item.title} numColumns={2} scrollEnabled={false} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F6FA' },
    container: { flex: 1 },
    contentContainer: { paddingBottom: 30 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F6FA' },
    welcomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
    welcomeText: { fontSize: 28, fontWeight: '300', color: '#4A148C' },

    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A148C'
    },
    statLabel: {
        fontSize: 13,
        color: '#6A1B9A',
        marginTop: 2,
    },

    chartWrapper: { backgroundColor: '#FFFFFF', borderRadius: 24, marginHorizontal: 16, paddingTop: 20, paddingBottom: 8, alignItems: 'center', shadowColor: '#9C8AB4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: '#FFFFFF' },
    chart: {},
    section: { marginTop: 24, paddingHorizontal: 12 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A148C', marginBottom: 8, paddingHorizontal: 12 },
    actionCardContainer: { flex: 1, padding: 8 },
    actionCard: { backgroundColor: '#FFFFFF', paddingVertical: 25, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#9C8AB4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, minHeight: 130 },
    actionTitle: { fontSize: 14, fontWeight: '600', color: '#6A1B9A', marginTop: 12, textAlign: 'center' },
});

export default DashboardScreen;