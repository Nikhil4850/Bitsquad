import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, TABLES } from '../config/supabase';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAuth = async () => {
    if (isSignup) {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    console.log('Login attempt with:', email, password);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      const user = data.user;
      console.log('Supabase login successful:', user.email);
      
      // Save to AsyncStorage for navigation
      await AsyncStorage.setItem('userToken', user.id);
      await AsyncStorage.setItem('userEmail', user.email);
      
      Alert.alert('Success', 'Login successful!');
      
      // Navigate to Dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace('Dashboard');
      }, 1000);
      
    } catch (error) {
      console.log('Supabase login error:', error);
      setIsLoading(false);
      
      if (error.message?.includes('Invalid login credentials')) {
        Alert.alert('Error', 'Incorrect email or password.');
      } else if (error.message?.includes('Email not confirmed')) {
        Alert.alert('Error', 'Please confirm your email address.');
      } else {
        Alert.alert('Error', 'Login failed: ' + error.message);
      }
    }
  };

  const handleSignup = async () => {
    console.log('Signup attempt with:', email, password, name);
    
    if (!email || !password || !name || (isSignup && !confirmPassword)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      const user = data.user;
      console.log('Supabase signup successful:', user.email);
      
      // Save user profile to database
      if (user) {
        await supabase
          .from(TABLES.USERS)
          .insert({
            id: user.id,
            email: user.email,
            name: name
          });
      }
      
      Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
      
      // Switch to login mode
      setIsLoading(false);
      setIsSignup(false);
      
    } catch (error) {
      console.log('Supabase signup error:', error);
      setIsLoading(false);
      
      if (error.message?.includes('User already registered')) {
        Alert.alert('Error', 'Email already registered. Please login.');
      } else if (error.message?.includes('Invalid email')) {
        Alert.alert('Error', 'Invalid email format.');
      } else {
        Alert.alert('Error', 'Signup failed: ' + error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isSignup ? 'Sign Up' : 'Sign In'}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>{isSignup ? 'Create Account!' : 'Welcome Back!'}</Text>
            <Text style={styles.subtitle}>
              {isSignup ? 'Sign up to start using AI Document Suite' : 'Sign in to continue with AI Document Suite'}
            </Text>

            {/* Name Input - Only for Signup */}
            {isSignup && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'name' && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={focusedInput === 'name' ? '#667eea' : '#999'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </Animated.View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  focusedInput === 'email' && styles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focusedInput === 'email' ? '#667eea' : '#999'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </Animated.View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedInput === 'password' ? '#667eea' : '#999'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Confirm Password Input - Only for Signup */}
            {isSignup && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'confirmPassword' && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={focusedInput === 'confirmPassword' ? '#667eea' : '#999'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}

            {/* Auth Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleAuth}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>{isSignup ? 'Sign Up' : 'Sign In'}</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#fff"
                      style={styles.loginButtonIcon}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity
              style={styles.toggleAuthButton}
              onPress={() => setIsSignup(!isSignup)}
            >
              <Text style={styles.toggleAuthText}>
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Default Credentials Info */}
            <View style={styles.credentialsInfo}>
              <Ionicons name="information-circle" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.credentialsText}>
                Default: harshadip@gmail.com / nnnnnnnn
              </Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    marginBottom: 30,
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    height: 55,
  },
  inputContainerFocused: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonIcon: {
    marginLeft: 10,
  },
  toggleAuthButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleAuthText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  credentialsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  credentialsText: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    marginLeft: 6,
  },
});

export default LoginScreen;
