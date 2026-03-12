import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [greeting, setGreeting] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadUserData();
    setGreetingBasedOnTime();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadUserData = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email.split('@')[0]);
    }
  };

  const setGreetingBasedOnTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const menuItems = [
    {
      id: 'scan',
      title: 'Scan Doc',
      subtitle: 'Scan documents',
      icon: 'scan',
      gradient: ['#667eea', '#764ba2'],
      screen: 'ScanDocument',
    },
    {
      id: 'advocate',
      title: 'Advocate Consult',
      subtitle: 'Legal Consultation',
      icon: 'people',
      gradient: ['#f093fb', '#f5576c'],
      screen: 'AdvocateConsult',
    },
    {
      id: 'chat',
      title: 'Chat AI',
      subtitle: 'Legal AI Assistant',
      icon: 'chatbubbles',
      gradient: ['#4facfe', '#00f2fe'],
      screen: 'ChatWithAI',
    },
    {
      id: 'reader',
      title: 'Doc Reader',
      subtitle: 'Read documents',
      icon: 'document-text',
      gradient: ['#43e97b', '#38f9d7'],
      screen: 'DocumentReader',
    },
    {
      id: 'view',
      title: 'View Doc',
      subtitle: 'View saved docs',
      icon: 'folder-open',
      gradient: ['#fa709a', '#fee140'],
      screen: 'DocumentList',
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings',
      gradient: ['#30cfd0', '#330867'],
      screen: null,
      action: () => Alert.alert('Settings', 'Settings page coming soon!'),
    },
  ];

  const recentActivity = [
    { id: 1, title: 'Document scanned', time: '2 min ago', icon: 'scan', color: '#667eea' },
    { id: 2, title: 'Text translated', time: '1 hour ago', icon: 'language', color: '#f5576c' },
    { id: 3, title: 'AI chat session', time: '3 hours ago', icon: 'chatbubbles', color: '#4facfe' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>{userEmail || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
              <Ionicons name="person-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color="#fff" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Documents</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="scan" size={24} color="#fff" />
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Scanned</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles" size={24} color="#fff" />
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>AI Chats</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions Grid */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() =>
                  item.action ? item.action() : navigation.navigate(item.screen)
                }
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gridIcon}
                >
                  <Ionicons name={item.icon} size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${activity.color}20` },
                ]}
              >
                <Ionicons name={activity.icon} size={20} color={activity.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          ))}
        </Animated.View>

        {/* AI Assistant Card */}
        <Animated.View
          style={[
            styles.aiCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiCardGradient}
          >
            <View style={styles.aiContent}>
              <View>
                <Text style={styles.aiTitle}>AI Assistant Ready</Text>
                <Text style={styles.aiSubtitle}>
                  Chat with Legal AI for instant help
                </Text>
              </View>
              <TouchableOpacity
                style={styles.aiButton}
                onPress={() => navigation.navigate('ChatWithAI')}
              >
                <Text style={styles.aiButtonText}>Chat Now</Text>
              </TouchableOpacity>
            </View>
            <Ionicons
              name="sparkles"
              size={60}
              color="rgba(255,255,255,0.2)"
              style={styles.aiBackgroundIcon}
            />
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="#667eea" />
          <Text style={[styles.bottomBarText, styles.bottomBarTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('ScanDocument')}>
          <Ionicons name="scan" size={24} color="#999" />
          <Text style={styles.bottomBarText}>Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('DocumentList')}>
          <Ionicons name="folder-open" size={24} color="#999" />
          <Text style={styles.bottomBarText}>Docs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#999" />
          <Text style={styles.bottomBarText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Chatbot Button */}
      <TouchableOpacity 
        style={styles.floatingChatButton}
        onPress={() => navigation.navigate('Chatbot')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.chatButtonGradient}
        >
          <Ionicons name="chatbubbles" size={28} color="#fff" />
          <View style={styles.chatNotificationDot} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gridItem: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gridIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#667eea',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  aiCard: {
    marginTop: 5,
  },
  aiCardGradient: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  aiContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  aiButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  aiButtonText: {
    color: '#f5576c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aiBackgroundIcon: {
    position: 'absolute',
    right: -10,
    bottom: -15,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  bottomBarText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  bottomBarTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  floatingChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  chatButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatNotificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4757',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default DashboardScreen;
