import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Image,
  TextInput,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  
  // Edit Profile states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  // Settings states
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [language, setLanguage] = useState('English');
  
  // Notification states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [documentAlerts, setDocumentAlerts] = useState(true);
  const [aiUpdates, setAiUpdates] = useState(false);
  
  // Privacy states
  const [biometricLock, setBiometricLock] = useState(false);
  const [documentEncryption, setDocumentEncryption] = useState(true);
  const [activityTracking, setActivityTracking] = useState(false);

  useEffect(() => {
    loadUserData();
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
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const name = await AsyncStorage.getItem('userName');
      const image = await AsyncStorage.getItem('profileImage');
      
      if (email) {
        setUserEmail(email);
        setEditEmail(email);
        setUserName(name || email.split('@')[0]);
        setEditName(name || email.split('@')[0]);
      }
      if (image) setProfileImage(image);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setDarkMode(parsed.darkMode || false);
        setAutoSave(parsed.autoSave !== false);
        setCloudSync(parsed.cloudSync !== false);
        setLanguage(parsed.language || 'English');
        setPushNotifications(parsed.pushNotifications !== false);
        setEmailNotifications(parsed.emailNotifications !== false);
        setDocumentAlerts(parsed.documentAlerts !== false);
        setAiUpdates(parsed.aiUpdates || false);
        setBiometricLock(parsed.biometricLock || false);
        setDocumentEncryption(parsed.documentEncryption !== false);
        setActivityTracking(parsed.activityTracking || false);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const currentSettings = {
        darkMode, autoSave, cloudSync, language,
        pushNotifications, emailNotifications, documentAlerts, aiUpdates,
        biometricLock, documentEncryption, activityTracking
      };
      const updated = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem('userSettings', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userName', editName);
      setUserName(editName);
      setActiveModal(null);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const faqData = [
    { q: 'How do I scan documents?', a: 'Go to the Scan tab and use your camera to capture documents. The app will automatically process and save them.' },
    { q: 'Is my data secure?', a: 'Yes! All documents are encrypted and stored securely. We use industry-standard security protocols.' },
    { q: 'Can I share documents?', a: 'Yes, you can share documents via the share button on any document view.' },
    { q: 'How does AI summarization work?', a: 'Our Legal AI analyzes your documents and generates intelligent summaries automatically.' },
  ];

  const languages = ['English', 'Hindi', 'Marathi', 'Spanish', 'French'];

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userEmail');
              navigation.replace('Welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: 'create-outline',
      color: '#667eea',
      action: () => setActiveModal('edit'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      color: '#43e97b',
      action: () => setActiveModal('settings'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      color: '#fa709a',
      action: () => setActiveModal('notifications'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-checkmark-outline',
      color: '#4facfe',
      action: () => setActiveModal('privacy'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#f093fb',
      action: () => setActiveModal('help'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      color: '#667eea',
      action: () => setActiveModal('about'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <TouchableOpacity onPress={showImagePickerOptions}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <Ionicons name="person" size={50} color="#667eea" />
                  )}
                </View>
                <View style={styles.cameraIconOverlay}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userName || 'User'}</Text>
            <Text style={styles.userEmail}>{userEmail || 'user@email.com'}</Text>
            <View style={styles.userStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Documents</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Scans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>AI Chats</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          style={[
            styles.menuContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#ff6b6b', '#ee5a5a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AI Document Suite v1.0.0</Text>
          <Text style={styles.poweredBy}>Powered by Legal AI</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={activeModal === 'edit'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.photoSection}>
                <TouchableOpacity onPress={showImagePickerOptions}>
                  <View style={styles.editPhotoContainer}>
                    {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.editProfileImage} />
                    ) : (
                      <View style={styles.editPhotoPlaceholder}>
                        <Ionicons name="person" size={50} color="#667eea" />
                      </View>
                    )}
                    <View style={styles.cameraIcon}>
                      <Ionicons name="camera" size={20} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text style={styles.changePhotoText}>Tap to change photo</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput style={styles.textInput} value={editName} onChangeText={setEditName} placeholder="Enter your name" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={[styles.textInput, styles.disabledInput]} value={editEmail} editable={false} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.textInput} value={editPhone} onChangeText={setEditPhone} placeholder="Enter phone number" keyboardType="phone-pad" />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveGradient}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={activeModal === 'settings'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Dark Mode</Text>
                </View>
                <Switch value={darkMode} onValueChange={(v) => { setDarkMode(v); saveSettings({ darkMode: v }); }} trackColor={{ false: '#ddd', true: '#43e97b' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="save" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Auto Save</Text>
                </View>
                <Switch value={autoSave} onValueChange={(v) => { setAutoSave(v); saveSettings({ autoSave: v }); }} trackColor={{ false: '#ddd', true: '#43e97b' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="cloud" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Cloud Sync</Text>
                </View>
                <Switch value={cloudSync} onValueChange={(v) => { setCloudSync(v); saveSettings({ cloudSync: v }); }} trackColor={{ false: '#ddd', true: '#43e97b' }} />
              </View>
              <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Language', '', languages.map(l => ({ text: l, onPress: () => { setLanguage(l); saveSettings({ language: l }); } })))}>
                <View style={styles.settingInfo}>
                  <Ionicons name="language" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Language</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.settingValue}>{language}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === 'notifications'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#fa709a', '#fee140']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="phone-portrait" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Push Notifications</Text>
                </View>
                <Switch value={pushNotifications} onValueChange={(v) => { setPushNotifications(v); saveSettings({ pushNotifications: v }); }} trackColor={{ false: '#ddd', true: '#fa709a' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="mail" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Email Notifications</Text>
                </View>
                <Switch value={emailNotifications} onValueChange={(v) => { setEmailNotifications(v); saveSettings({ emailNotifications: v }); }} trackColor={{ false: '#ddd', true: '#fa709a' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="document-text" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Document Alerts</Text>
                </View>
                <Switch value={documentAlerts} onValueChange={(v) => { setDocumentAlerts(v); saveSettings({ documentAlerts: v }); }} trackColor={{ false: '#ddd', true: '#fa709a' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="sparkles" size={22} color="#667eea" />
                  <Text style={styles.settingText}>AI Updates</Text>
                </View>
                <Switch value={aiUpdates} onValueChange={(v) => { setAiUpdates(v); saveSettings({ aiUpdates: v }); }} trackColor={{ false: '#ddd', true: '#fa709a' }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal visible={activeModal === 'privacy'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy & Security</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="finger-print" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Biometric Lock</Text>
                </View>
                <Switch value={biometricLock} onValueChange={(v) => { setBiometricLock(v); saveSettings({ biometricLock: v }); }} trackColor={{ false: '#ddd', true: '#4facfe' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="lock-closed" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Document Encryption</Text>
                </View>
                <Switch value={documentEncryption} onValueChange={(v) => { setDocumentEncryption(v); saveSettings({ documentEncryption: v }); }} trackColor={{ false: '#ddd', true: '#4facfe' }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="eye" size={22} color="#667eea" />
                  <Text style={styles.settingText}>Activity Tracking</Text>
                </View>
                <Switch value={activityTracking} onValueChange={(v) => { setActivityTracking(v); saveSettings({ activityTracking: v }); }} trackColor={{ false: '#ddd', true: '#4facfe' }} />
              </View>
              <TouchableOpacity style={styles.securityButton} onPress={() => Alert.alert('Change Password', 'Coming soon!')}>
                <Ionicons name="key" size={22} color="#667eea" />
                <Text style={styles.securityButtonText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.securityButton} onPress={() => Alert.alert('Clear Data', 'Clear cache?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared!') }])}>
                <Ionicons name="trash" size={22} color="#ff6b6b" />
                <Text style={[styles.securityButtonText, { color: '#ff6b6b' }]}>Clear App Data</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={activeModal === 'help'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {faqData.map((faq, index) => (
                <TouchableOpacity key={index} style={styles.faqItem} onPress={() => Alert.alert(faq.q, faq.a)}>
                  <View style={styles.faqHeader}>
                    <Ionicons name="help-circle" size={20} color="#f5576c" />
                    <Text style={styles.faqQuestion} numberOfLines={2}>{faq.q}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
              <Text style={styles.sectionTitle}>Contact Support</Text>
              <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact', 'Email: support@aidocsuite.com')}>
                <Ionicons name="mail" size={22} color="#667eea" />
                <Text style={styles.contactText}>Email Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Chat', 'Live chat coming soon!')}>
                <Ionicons name="chatbubbles" size={22} color="#667eea" />
                <Text style={styles.contactText}>Live Chat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={activeModal === 'about'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.aboutHeader}>
                <View style={styles.aboutLogo}>
                  <Ionicons name="document-text" size={50} color="#667eea" />
                </View>
                <Text style={styles.aboutTitle}>AI Document Suite</Text>
                <Text style={styles.aboutVersion}>Version 1.0.0</Text>
                <Text style={styles.aboutTagline}>Powered by Legal AI</Text>
              </View>
              <View style={styles.aboutInfo}>
                <Text style={styles.aboutDescription}>AI Document Suite is your intelligent document management companion. Scan, translate, summarize, and chat with your documents using advanced AI technology.</Text>
              </View>
              <View style={styles.featuresList}>
                <Text style={styles.sectionTitle}>Key Features</Text>
                <View style={styles.featureItem}><Ionicons name="scan" size={20} color="#667eea" /><Text style={styles.featureText}>Smart Document Scanning</Text></View>
                <View style={styles.featureItem}><Ionicons name="sparkles" size={20} color="#667eea" /><Text style={styles.featureText}>AI-Powered Summarization</Text></View>
                <View style={styles.featureItem}><Ionicons name="language" size={20} color="#667eea" /><Text style={styles.featureText}>Multi-language Translation</Text></View>
                <View style={styles.featureItem}><Ionicons name="chatbubbles" size={20} color="#667eea" /><Text style={styles.featureText}>AI Chat Assistant</Text></View>
              </View>
              <View style={styles.legalLinks}>
                <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'Your data is protected.')}><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Terms of Service', 'By using this app, you agree to our terms.')}><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
              </View>
              <Text style={styles.copyright}>© 2024 AI Document Suite. All rights reserved.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  profileGradient: {
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  poweredBy: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  // Edit Profile Styles
  photoSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  editPhotoContainer: {
    position: 'relative',
  },
  editProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editPhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoText: {
    marginTop: 10,
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#666',
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Settings Styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  // Privacy Styles
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  // Help Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  faqQuestion: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  // About Styles
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  aboutLogo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  aboutVersion: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 5,
  },
  aboutTagline: {
    fontSize: 14,
    color: '#999',
  },
  aboutInfo: {
    backgroundColor: '#f5f7fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  legalLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Profile Image Styles
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default ProfileScreen;
