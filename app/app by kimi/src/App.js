import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './config/supabase';
import { Session } from '@supabase/supabase-js';
import { AppProvider } from './context/AppContext';
import NotificationService from './services/NotificationService';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScanDocumentScreen from './screens/ScanDocumentScreen';
import TranslateScreen from './screens/TranslateScreen';
import ChatWithAIScreen from './screens/ChatWithAIScreen';
import DocumentReaderScreen from './screens/DocumentReaderScreen';
import ViewDocumentScreen from './screens/ViewDocumentScreen';
import DocumentListScreen from './screens/DocumentListScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import AdvocateConsultScreen from './screens/AdvocateConsultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Request notification permissions
    NotificationService.requestPermissions();
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('User is authenticated:', session.user.email);
        setUserToken(session.user.id);
        AsyncStorage.setItem('userToken', session.user.id);
        AsyncStorage.setItem('userEmail', session.user.email);
        
        // Send welcome notification
        NotificationService.sendWelcomeNotification(session.user.email);
      } else {
        console.log('User is not authenticated');
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userEmail');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserToken(session.user.id);
        AsyncStorage.setItem('userToken', session.user.id);
        AsyncStorage.setItem('userEmail', session.user.email);
      } else {
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userEmail');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F5F7FA' }
            }}
            initialRouteName="Welcome"
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ScanDocument" component={ScanDocumentScreen} />
            <Stack.Screen name="Translate" component={TranslateScreen} />
            <Stack.Screen name="ChatWithAI" component={ChatWithAIScreen} />
            <Stack.Screen name="DocumentReader" component={DocumentReaderScreen} />
            <Stack.Screen name="ViewDocument" component={ViewDocumentScreen} />
            <Stack.Screen name="DocumentList" component={DocumentListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
            <Stack.Screen name="AdvocateConsult" component={AdvocateConsultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
