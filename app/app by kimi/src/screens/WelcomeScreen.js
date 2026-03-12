import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated Circles Background */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.circle,
              styles.circle1,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle2,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle3,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
        </View>

        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={80} color="#fff" />
            <View style={styles.aiBadge}>
              <Text style={styles.aiText}>AI</Text>
            </View>
          </View>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>AI Document Suite</Text>
          <Text style={styles.subtitle}>
            Scan • Translate • Chat • Read
          </Text>
        </Animated.View>

        {/* Features Preview */}
        <Animated.View
          style={[
            styles.featuresContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="scan" size={24} color="#667eea" />
            </View>
            <Text style={styles.featureText}>Scan</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="language" size={24} color="#667eea" />
            </View>
            <Text style={styles.featureText}>Translate</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubbles" size={24} color="#667eea" />
            </View>
            <Text style={styles.featureText}>Chat AI</Text>
          </View>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ffffff', '#f0f0f0']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#667eea"
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Text */}
        <Animated.View
          style={[
            styles.bottomContainer,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.bottomText}>
            Powered by Legal AI Technology
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  circleContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.3,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: height * 0.1,
    left: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.15)',
    bottom: height * 0.2,
    right: -30,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: height * 0.4,
    right: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  aiBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  aiText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    letterSpacing: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
    gap: 20,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});

export default WelcomeScreen;
