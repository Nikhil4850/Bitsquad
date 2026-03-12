import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LegalAIService from '../services/LegalAIService';

const { width, height } = Dimensions.get('window');

const AdvocateConsultScreen = ({ navigation }) => {
  const [consultationType, setConsultationType] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [consultationResult, setConsultationResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);

  const consultationTypes = [
    { id: 'criminal', title: 'Criminal Law', icon: 'shield-checkmark', description: 'Legal advice for criminal matters' },
    { id: 'civil', title: 'Civil Law', icon: 'document-text', description: 'Disputes between individuals or organizations' },
    { id: 'family', title: 'Family Law', icon: 'people', description: 'Marriage, divorce, child custody matters' },
    { id: 'property', title: 'Property Law', icon: 'home', description: 'Real estate and property disputes' },
    { id: 'corporate', title: 'Corporate Law', icon: 'business', description: 'Business and commercial legal matters' },
    { id: 'labor', title: 'Labor Law', icon: 'briefcase', description: 'Employment and workplace legal issues' },
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low Priority', color: '#4facfe' },
    { id: 'normal', label: 'Normal', color: '#43e97b' },
    { id: 'high', label: 'High Priority', color: '#fa709a' },
    { id: 'urgent', label: 'Urgent', color: '#f5576c' },
  ];

  const handleConsultation = async () => {
    if (!consultationType) {
      Alert.alert('Error', 'Please select a consultation type');
      return;
    }

    if (!caseDescription.trim()) {
      Alert.alert('Error', 'Please describe your case or legal issue');
      return;
    }

    setIsLoading(true);
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an experienced legal consultant providing initial legal advice. The user has selected ${consultationType} law consultation with ${urgency} urgency. Provide comprehensive legal guidance including:
          1. Initial legal assessment
          2. Relevant laws and regulations
          3. Recommended next steps
          4. Documentation needed
          5. Timeline expectations
          6. When to seek professional legal help
          Be thorough but clear, and include a disclaimer that this is preliminary advice and they should consult with a qualified attorney.`
        },
        {
          role: 'user',
          content: `Case Description: ${caseDescription}\n\nConsultation Type: ${consultationType}\nUrgency: ${urgency}`
        }
      ];

      const result = await LegalAIService.chatWithAI(messages);
      setConsultationResult(result);
      setShowResult(true);
      
    } catch (error) {
      console.error('Consultation error:', error);
      Alert.alert('Error', 'Failed to get consultation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetConsultation = () => {
    setConsultationType('');
    setCaseDescription('');
    setUrgency('normal');
    setConsultationResult('');
    setShowResult(false);
  };

  const renderConsultationType = (type) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.typeCard,
        consultationType === type.id && styles.typeCardSelected
      ]}
      onPress={() => setConsultationType(type.id)}
    >
      <View style={[
        styles.typeIcon,
        consultationType === type.id && styles.typeCardSelectedIcon
      ]}>
        <Ionicons 
          name={type.icon} 
          size={24} 
          color={consultationType === type.id ? '#fff' : '#667eea'} 
        />
      </View>
      <Text style={[
        styles.typeTitle,
        consultationType === type.id && styles.typeTitleSelected
      ]}>
        {type.title}
      </Text>
      <Text style={[
        styles.typeDescription,
        consultationType === type.id && styles.typeDescriptionSelected
      ]}>{type.description}</Text>
    </TouchableOpacity>
  );

  const renderUrgencyLevel = (level) => (
    <TouchableOpacity
      key={level.id}
      style={[
        styles.urgencyButton,
        urgency === level.id && { backgroundColor: level.color }
      ]}
      onPress={() => setUrgency(level.id)}
    >
      <Text style={[
        styles.urgencyText,
        urgency === level.id && styles.urgencyTextSelected
      ]}>
        {level.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Advocate Consult</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {!showResult ? (
            <>
              {/* Consultation Types */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Consultation Type</Text>
                <View style={styles.typesGrid}>
                  {consultationTypes.map(renderConsultationType)}
                </View>
              </View>

              {/* Case Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Describe Your Case</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="document-text" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Please provide details about your legal issue..."
                    placeholderTextColor="#999"
                    value={caseDescription}
                    onChangeText={setCaseDescription}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Urgency Level */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Urgency Level</Text>
                <View style={styles.urgencyContainer}>
                  {urgencyLevels.map(renderUrgencyLevel)}
                </View>
              </View>

              {/* Consult Button */}
              <TouchableOpacity
                style={styles.consultButton}
                onPress={handleConsultation}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.consultButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="people" size={20} color="#fff" />
                      <Text style={styles.consultButtonText}>Get Legal Consultation</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            /* Consultation Result */
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={40} color="#43e97b" />
                <Text style={styles.resultTitle}>Legal Consultation Ready</Text>
                <Text style={styles.resultSubtitle}>Here's your preliminary legal advice</Text>
              </View>

              <View style={styles.resultContent}>
                <Text style={styles.resultText}>{consultationResult}</Text>
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={resetConsultation}
                >
                  <Ionicons name="refresh" size={20} color="#667eea" />
                  <Text style={styles.actionButtonText}>New Consultation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Info', 'Consultation saved to your records')}
                >
                  <Ionicons name="bookmark" size={20} color="#667eea" />
                  <Text style={styles.actionButtonText}>Save Consultation</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContent: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  typeCardSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  typeCardSelectedIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  typeTitleSelected: {
    color: '#fff',
  },
  typeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  typeDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  urgencyButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  urgencyTextSelected: {
    color: '#fff',
  },
  consultButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
  },
  consultButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default AdvocateConsultScreen;
