import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LegalAIService from '../services/LegalAIService';

const { width } = Dimensions.get('window');

const ChatWithAIScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by Legal AI. I can help you with:\n\n• Document analysis\n• Translations\n• General questions\n• Writing assistance\n• Code help\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      apiMessages.push({ role: 'user', content: inputText });

      const response = await LegalAIService.chatWithAI(apiMessages);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: 'Hello! I\'m your AI assistant powered by Legal AI. I can help you with:\n\n• Document analysis\n• Translations\n• General questions\n• Writing assistance\n• Code help\n\nHow can I assist you today?',
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isAI = item.role === 'assistant';
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessage : styles.userMessage,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.messageHeader}>
          <View style={[styles.avatar, isAI ? styles.aiAvatar : styles.userAvatar]}>
            <Ionicons
              name={isAI ? 'sparkles' : 'person'}
              size={16}
              color="#fff"
            />
          </View>
          <Text style={styles.senderName}>
            {isAI ? 'Grok AI' : 'You'}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const quickPrompts = [
    { icon: 'document-text', text: 'Analyze a document' },
    { icon: 'language', text: 'Translate text' },
    { icon: 'create', text: 'Help me write' },
    { icon: 'code-slash', text: 'Code assistance' },
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.aiStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.headerTitle}>Grok AI</Text>
            </View>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#667eea" />
              <Text style={styles.typingText}>AI is typing...</Text>
            </View>
          </View>
        )}

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <View style={styles.quickPrompts}>
            <Text style={styles.quickPromptsTitle}>Quick Actions</Text>
            <View style={styles.promptsRow}>
              {quickPrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptChip}
                  onPress={() => setInputText(prompt.text)}
                >
                  <Ionicons name={prompt.icon} size={14} color="#667eea" />
                  <Text style={styles.promptText}>{prompt.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxHeight={100}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => Alert.alert('Attach', 'File attachment coming soon!')}
            >
              <Ionicons name="attach" size={24} color="#667eea" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#f093fb', '#f5576c'] : ['#ddd', '#ccc']}
              style={styles.sendGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  headerCenter: {
    alignItems: 'center',
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  clearButton: {
    padding: 10,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: width * 0.85,
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatar: {
    backgroundColor: '#667eea',
  },
  userAvatar: {
    backgroundColor: '#f5576c',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#667eea',
    borderTopRightRadius: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: '#333',
  },
  userText: {
    color: '#fff',
  },
  typingContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typingText: {
    fontSize: 14,
    color: '#667eea',
  },
  quickPrompts: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickPromptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  promptsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptText: {
    fontSize: 13,
    color: '#667eea',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 10,
  },
  attachButton: {
    padding: 8,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatWithAIScreen;
