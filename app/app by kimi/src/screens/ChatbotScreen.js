import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "👋 Hello! I'm your AI Assistant. I can help you with:\n\n📄 Scanning documents\n🔍 Finding your files\n🤖 Using AI features\n⚙️ App settings\n\nWhat would you like help with?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadChatHistory();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('chatHistory');
      if (history) {
        const parsed = JSON.parse(history);
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.log('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
    } catch (error) {
      console.log('Error saving chat history:', error);
    }
  };

  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Scan related
    if (lowerMsg.includes('scan') || lowerMsg.includes('camera') || lowerMsg.includes('photo') || lowerMsg.includes('picture')) {
      return "📸 **Scanning Documents:**\n\n1. Tap the **Scan** tab at the bottom\n2. Point camera at document\n3. Auto-capture or tap button\n4. Review and save\n\n**Tips:**\n- Good lighting works best\n- Keep document flat\n- AI will auto-summarize!";
    }
    
    // Documents related
    if (lowerMsg.includes('doc') || lowerMsg.includes('file') || lowerMsg.includes('pdf') || lowerMsg.includes('view')) {
      return "📁 **Managing Documents:**\n\n1. Go to **Docs** tab\n2. View all your files\n3. Tap to open & read\n4. Use search to find quickly\n\n**Features:**\n- Grid/List view toggle\n- Document categories\n- Quick search\n- Share & download options";
    }
    
    // AI/Summarize related
    if (lowerMsg.includes('ai') || lowerMsg.includes('summary') || lowerMsg.includes('summarize') || lowerMsg.includes('grok')) {
      return "🤖 **AI Features:**\n\n1. **Auto-Summarization:**\n   - Scan any document\n   - AI extracts key points\n   - Saves time reading!\n\n2. **Smart Chat:**\n   - Ask questions about docs\n   - Get instant answers\n   - Powered by Grok AI\n\n3. **Translation:**\n   - Convert to any language\n   - 50+ languages supported";
    }
    
    // Profile/Settings related
    if (lowerMsg.includes('profile') || lowerMsg.includes('setting') || lowerMsg.includes('account') || lowerMsg.includes('logout')) {
      return "👤 **Profile & Settings:**\n\n1. Tap **Profile** at bottom right\n2. Edit your info & photo\n3. Configure settings:\n   - Dark mode\n   - Notifications\n   - Cloud sync\n   - Privacy\n\n**Quick Actions:**\n- Change password\n- Clear cache\n- Contact support";
    }
    
    // Translation related
    if (lowerMsg.includes('translate') || lowerMsg.includes('language') || lowerMsg.includes('hindi') || lowerMsg.includes('marathi')) {
      return "🌐 **Translation:**\n\n1. Open any scanned document\n2. Tap **Translate** button\n3. Select target language:\n   - English, Hindi, Marathi\n   - Spanish, French & more\n\n**Features:**\n- Instant conversion\n- Preserves formatting\n- Download translated PDF";
    }
    
    // Navigation/Help related
    if (lowerMsg.includes('how') || lowerMsg.includes('help') || lowerMsg.includes('use') || lowerMsg.includes('start')) {
      return "🎯 **Getting Started:**\n\n1. **Scan** - Capture documents\n2. **Docs** - View all files\n3. **AI Chat** - Ask about documents\n4. **Profile** - Settings & account\n\n**Quick Tips:**\n📱 Bottom bar for navigation\n🔍 Search docs anytime\n⭐ Star favorites for quick access";
    }
    
    // Login/Security related
    if (lowerMsg.includes('login') || lowerMsg.includes('password') || lowerMsg.includes('secure') || lowerMsg.includes('private')) {
      return "🔐 **Security Features:**\n\n1. **Biometric Lock:**\n   - Enable in Profile > Privacy\n   - Fingerprint/Face ID\n\n2. **Document Encryption:**\n   - All files encrypted\n   - Secure cloud storage\n\n3. **Privacy Settings:**\n   - Control data sharing\n   - Activity tracking toggle\n   - Clear data anytime";
    }
    
    // Greeting
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
      return "👋 Hello there! I'm here to help you use AI Document Suite. Ask me about:\n\n• Scanning documents\n• Managing files\n• AI features\n• App settings\n• Getting started\n\nWhat can I help you with today?";
    }
    
    // Thank you
    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return "🙏 You're welcome! I'm happy to help. Need anything else? Feel free to ask anytime!";
    }
    
    // Goodbye
    if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
      return "👋 Goodbye! Have a great day. I'm here 24/7 if you need help. Happy documenting! 📄✨";
    }
    
    // Default response
    return "🤔 I'm not sure I understood. I can help you with:\n\n📸 Scanning documents\n📁 Managing files\n🤖 AI features\n⚙️ App settings\n🌐 Translation\n\nTry asking about one of these topics!";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: getBotResponse(userMessage.text),
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, botResponse];
      setMessages(finalMessages);
      setIsTyping(false);
      saveChatHistory(finalMessages);
    }, 1000);
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
            const welcomeMessage = {
              id: 'welcome',
              type: 'bot',
              text: "👋 Hello! I'm your AI Assistant. I can help you with:\n\n📄 Scanning documents\n🔍 Finding your files\n🤖 Using AI features\n⚙️ App settings\n\nWhat would you like help with?",
              timestamp: new Date().toISOString(),
            };
            setMessages([welcomeMessage]);
            saveChatHistory([welcomeMessage]);
          },
        },
      ]
    );
  };

  const quickQuestions = [
    { icon: 'scan', text: 'How to scan?', color: '#667eea' },
    { icon: 'document-text', text: 'View documents', color: '#43e97b' },
    { icon: 'sparkles', text: 'AI features', color: '#fa709a' },
    { icon: 'settings', text: 'Settings help', color: '#4facfe' },
  ];

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.type === 'user' ? styles.userMessage : styles.botMessage]}>
      {item.type === 'bot' && (
        <View style={styles.botAvatar}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatarGradient}>
            <Ionicons name="help-circle" size={20} color="#fff" />
          </LinearGradient>
        </View>
      )}
      <View style={[styles.messageBubble, item.type === 'user' ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, item.type === 'user' ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.botIndicator}>
              <Ionicons name="chatbubbles" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>Always here to help</Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickQuestionsScroll}>
          {quickQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickQuestion, { backgroundColor: `${q.color}15` }]}
              onPress={() => {
                setInputText(q.text);
                setTimeout(() => sendMessage(), 100);
              }}
            >
              <Ionicons name={q.icon} size={18} color={q.color} />
              <Text style={[styles.quickQuestionText, { color: q.color }]}>{q.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messagesList, { paddingBottom: 100 }]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.botAvatarSmall}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatarGradientSmall}>
              <Ionicons name="help-circle" size={14} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.typingBubble}>
            <Animated.View style={styles.typingAnimation}>
              <Text style={styles.typingText}>Typing</Text>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </Animated.View>
          </View>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#667eea', '#764ba2'] : ['#ccc', '#bbb']}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={20} color="#fff" />
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  clearButton: {
    padding: 10,
  },
  quickQuestionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickQuestionsScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  quickQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  quickQuestionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    marginRight: 8,
  },
  avatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  botAvatarSmall: {
    marginRight: 8,
  },
  avatarGradientSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#999',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatbotScreen;
