import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Clipboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LegalAIService from '../services/LegalAIService';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

const TranslateScreen = ({ navigation }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState(languages[0]);
  const [targetLang, setTargetLang] = useState(languages[1]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('source');
  const [translationHistory, setTranslationHistory] = useState([]);

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

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await LegalAIService.translateText(sourceText, targetLang.name);
      setTranslatedText(result);
      
      // Add to history
      const newItem = {
        id: Date.now(),
        source: sourceText,
        translated: result,
        from: sourceLang.name,
        to: targetLang.name,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTranslationHistory(prev => [newItem, ...prev.slice(0, 9)]);
    } catch (error) {
      Alert.alert('Error', 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Text copied to clipboard');
  };

  const openLanguagePicker = (mode) => {
    setPickerMode(mode);
    setShowLanguagePicker(true);
  };

  const selectLanguage = (lang) => {
    if (pickerMode === 'source') {
      setSourceLang(lang);
    } else {
      setTargetLang(lang);
    }
    setShowLanguagePicker(false);
  };

  const clearText = () => {
    setSourceText('');
    setTranslatedText('');
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
          <Text style={styles.headerTitle}>Translate</Text>
          <TouchableOpacity onPress={clearText} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Language Selector */}
          <Animated.View
            style={[
              styles.languageBar,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.langButton}
              onPress={() => openLanguagePicker('source')}
            >
              <Text style={styles.langFlag}>{sourceLang.flag}</Text>
              <Text style={styles.langName}>{sourceLang.name}</Text>
              <Ionicons name="chevron-down" size={16} color="#667eea" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.swapGradient}
              >
                <Ionicons name="swap-horizontal" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => openLanguagePicker('target')}
            >
              <Text style={styles.langFlag}>{targetLang.flag}</Text>
              <Text style={styles.langName}>{targetLang.name}</Text>
              <Ionicons name="chevron-down" size={16} color="#667eea" />
            </TouchableOpacity>
          </Animated.View>

          {/* Source Input */}
          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Source Text</Text>
              <TouchableOpacity onPress={() => copyToClipboard(sourceText)}>
                <Ionicons name="copy-outline" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Enter text to translate..."
              placeholderTextColor="#999"
              value={sourceText}
              onChangeText={setSourceText}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{sourceText.length} characters</Text>
          </Animated.View>

          {/* Translate Button */}
          <TouchableOpacity
            style={styles.translateButton}
            onPress={handleTranslate}
            disabled={isTranslating}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.translateGradient}
            >
              {isTranslating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="language" size={20} color="#fff" />
                  <Text style={styles.translateText}>Translate</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Translation Result */}
          {translatedText ? (
            <Animated.View
              style={[
                styles.card,
                styles.resultCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Translation</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(translatedText)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="copy-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="volume-high-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.translatedText}>{translatedText}</Text>
            </Animated.View>
          ) : null}

          {/* Translation History */}
          {translationHistory.length > 0 && (
            <Animated.View
              style={[
                styles.historyContainer,
                { opacity: fadeAnim },
              ]}
            >
              <Text style={styles.historyTitle}>Recent Translations</Text>
              {translationHistory.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => {
                    setSourceText(item.source);
                    setTranslatedText(item.translated);
                  }}
                >
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyLangs}>
                      {item.from} → {item.to}
                    </Text>
                    <Text style={styles.historyTime}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.historySource} numberOfLines={1}>
                    {item.source}
                  </Text>
                  <Text style={styles.historyTranslated} numberOfLines={1}>
                    {item.translated}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Language Picker Modal */}
      {showLanguagePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {pickerMode === 'source' ? 'Source' : 'Target'} Language
              </Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    ((pickerMode === 'source' && sourceLang.code === lang.code) ||
                      (pickerMode === 'target' && targetLang.code === lang.code)) &&
                      styles.languageItemSelected,
                  ]}
                  onPress={() => selectLanguage(lang)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  {((pickerMode === 'source' && sourceLang.code === lang.code) ||
                    (pickerMode === 'target' && targetLang.code === lang.code)) && (
                    <Ionicons name="checkmark" size={20} color="#667eea" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langFlag: {
    fontSize: 24,
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  swapButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  swapGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 10,
  },
  translateButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  translateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  translateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
  translatedText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  historyContainer: {
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyLangs: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  historyTime: {
    fontSize: 11,
    color: '#999',
  },
  historySource: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  historyTranslated: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  languageList: {
    padding: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  languageItemSelected: {
    backgroundColor: '#f0f4ff',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 15,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default TranslateScreen;
