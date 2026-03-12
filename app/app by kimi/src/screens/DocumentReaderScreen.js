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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import LegalAIService from '../services/LegalAIService';

const DocumentReaderScreen = ({ navigation }) => {
  const [documentContent, setDocumentContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf', 'application/msword'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        setFileName(result.assets[0].name);
        // For demo, we'll use sample text
        const sampleText = `This is a sample document content for demonstration purposes.

The AI Document Suite is a comprehensive mobile application designed to help users manage, analyze, and interact with their documents using advanced AI technology powered by Grok.

Key Features:
1. Document Scanning - Use your camera to scan physical documents
2. AI Translation - Translate documents to multiple languages
3. AI Chat Assistant - Get intelligent responses to your queries
4. Document Analysis - Get insights and summaries of your documents
5. Document Storage - Save and organize your documents

The application uses state-of-the-art machine learning models to provide accurate and helpful assistance for all your document-related tasks.`;
        
        setDocumentContent(sampleText);
        setWordCount(sampleText.split(/\s+/).length);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const analyzeDocument = async () => {
    if (!documentContent) {
      Alert.alert('Error', 'Please upload a document first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await LegalAIService.readDocument(documentContent);
      setAnalysis(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze document');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearDocument = () => {
    setDocumentContent('');
    setAnalysis('');
    setFileName('');
    setWordCount(0);
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Document Reader</Text>
          <TouchableOpacity onPress={clearDocument} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload Section */}
        <Animated.View
          style={[
            styles.uploadSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {!documentContent ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.uploadGradient}
              >
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={50} color="#fff" />
                </View>
                <Text style={styles.uploadTitle}>Upload Document</Text>
                <Text style={styles.uploadSubtitle}>
                  Tap to select a document from your device
                </Text>
                <Text style={styles.supportedFormats}>
                  Supports: TXT, PDF, DOC
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileInfo}>
              <View style={styles.fileIcon}>
                <Ionicons name="document-text" size={40} color="#667eea" />
              </View>
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{fileName || 'document.txt'}</Text>
                <Text style={styles.fileStats}>
                  {wordCount} words • {documentContent.length} characters
                </Text>
              </View>
              <TouchableOpacity style={styles.changeFileButton} onPress={pickDocument}>
                <Text style={styles.changeFileText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Document Content */}
        {documentContent ? (
          <Animated.View
            style={[
              styles.contentSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Document Content</Text>
              <TouchableOpacity onPress={() => {
                Alert.alert('Edit Mode', 'Full text editor coming soon!');
              }}>
                <Ionicons name="create-outline" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
              <TextInput
                style={styles.documentInput}
                multiline
                value={documentContent}
                onChangeText={setDocumentContent}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>
        ) : null}

        {/* AI Analysis Button */}
        {documentContent ? (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeDocument}
            disabled={isAnalyzing}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.analyzeGradient}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.analyzeText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={24} color="#fff" />
                  <Text style={styles.analyzeText}>Analyze with AI</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        {/* Analysis Result */}
        {analysis ? (
          <Animated.View
            style={[
              styles.analysisSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={14} color="#fff" />
                <Text style={styles.aiBadgeText}>Legal AI</Text>
              </View>
            </View>
            <View style={styles.analysisContent}>
              <Text style={styles.analysisText}>{analysis}</Text>
            </View>
            <View style={styles.analysisActions}>
              <TouchableOpacity style={styles.actionChip}>
                <Ionicons name="copy-outline" size={16} color="#667eea" />
                <Text style={styles.actionChipText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip}>
                <Ionicons name="share-outline" size={16} color="#667eea" />
                <Text style={styles.actionChipText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip}>
                <Ionicons name="download-outline" size={16} color="#667eea" />
                <Text style={styles.actionChipText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : null}

        {/* Quick Stats */}
        {documentContent ? (
          <Animated.View
            style={[
              styles.statsSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.sectionTitle}>Document Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wordCount}</Text>
                <Text style={styles.statLabel}>Words</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{documentContent.split(/[.!?]+/).length - 1}</Text>
                <Text style={styles.statLabel}>Sentences</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{documentContent.split(/\n\n+/).length}</Text>
                <Text style={styles.statLabel}>Paragraphs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{documentContent.length}</Text>
                <Text style={styles.statLabel}>Characters</Text>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>
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
  clearButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadGradient: {
    padding: 40,
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  supportedFormats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fileIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 15,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fileStats: {
    fontSize: 13,
    color: '#666',
  },
  changeFileButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  changeFileText: {
    color: '#667eea',
    fontSize: 13,
    fontWeight: '600',
  },
  contentSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 15,
    padding: 15,
    minHeight: 200,
  },
  documentInput: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    minHeight: 180,
  },
  analyzeButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  analyzeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analysisContent: {
    backgroundColor: '#f8f9ff',
    borderRadius: 15,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  analysisText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  analysisActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 5,
  },
  actionChipText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 15,
  },
  statItem: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#f8f9ff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default DocumentReaderScreen;
