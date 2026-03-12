// Enhanced App Context for Global State Management
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userPreferences, setUserPreferences] = useState({});

  // Initialize notifications
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  // Load user preferences
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        setUserPreferences(parsed);
        setIsDarkMode(parsed.darkMode || false);
        setNotificationsEnabled(parsed.notificationsEnabled !== false);
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const saveUserPreferences = async (newPreferences) => {
    try {
      const updated = { ...userPreferences, ...newPreferences };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      setUserPreferences(updated);
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    saveUserPreferences({ darkMode: newDarkMode });
  };

  const toggleNotifications = () => {
    const newNotificationsEnabled = !notificationsEnabled;
    setNotificationsEnabled(newNotificationsEnabled);
    saveUserPreferences({ notificationsEnabled: newNotificationsEnabled });
  };

  const sendNotification = async (title, body, data = {}) => {
    if (!notificationsEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.log('Error sending notification:', error);
    }
  };

  const value = {
    isDarkMode,
    notificationsEnabled,
    userPreferences,
    toggleDarkMode,
    toggleNotifications,
    sendNotification,
    saveUserPreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
