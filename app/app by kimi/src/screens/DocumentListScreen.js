import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, TABLES } from '../config/supabase';

const DocumentListScreen = ({ navigation, route }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentUser, setCurrentUser] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDocuments();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadDocuments = async () => {
    try {
      // Get current user
      const userToken = await AsyncStorage.getItem('userToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
      setCurrentUser(userEmail || '');
      
      let allDocuments = [];
      
      // Load local documents first
      try {
        const localDocs = await AsyncStorage.getItem('localDocuments');
        const localDocuments = localDocs ? JSON.parse(localDocs) : [];
        
        // Filter local documents for current user
        const userLocalDocs = localDocuments.filter(doc => doc.user_id === userEmail);
        
        // Add local documents with local flag
        allDocuments = [...userLocalDocs];
        console.log(`Loaded ${userLocalDocs.length} local documents`);
        
      } catch (localError) {
        console.log('Error loading local documents:', localError);
      }
      
      // Load cloud documents if user is authenticated
      if (userToken) {
        try {
          const { data, error } = await supabase
            .from(TABLES.DOCUMENTS)
            .select('*')
            .eq('user_id', userToken)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.log('Error loading cloud documents:', error);
          } else if (data) {
            // Add cloud documents with cloud flag
            const cloudDocuments = data.map(doc => ({
              ...doc,
              isLocal: false,
              cloudSynced: true
            }));
            
            // Merge local and cloud documents
            allDocuments = [...allDocuments, ...cloudDocuments];
            console.log(`Loaded ${cloudDocuments.length} cloud documents`);
          }
        } catch (cloudError) {
          console.log('Error loading cloud documents:', cloudError);
        }
      }
      
      // Sort all documents by creation date (newest first)
      allDocuments.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setDocuments(allDocuments);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
      setIsLoading(false);
    }
  };

  const deleteDocument = (id) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== id));
          },
        },
      ]
    );
  };

  const getFileIcon = (type) => {
    const iconMap = {
      pdf: 'document-text',
      doc: 'document',
      docx: 'document',
      ppt: 'easel',
      pptx: 'easel',
      xls: 'grid',
      xlsx: 'grid',
      image: 'image',
      txt: 'text',
    };
    return iconMap[type] || 'document';
  };

  const getDocumentColor = (classification) => {
    const colorMap = {
      FINANCIAL: ['#43e97b', '#38f9d7'],
      LEGAL: ['#667eea', '#764ba2'],
      MEDICAL: ['#f093fb', '#f5576c'],
      GENERAL: ['#fa709a', '#fee140'],
    };
    return colorMap[classification] || ['#667eea', '#764ba2'];
  };

  const getDocumentIcon = (classification) => {
    const iconMap = {
      FINANCIAL: 'card',
      LEGAL: 'document-text',
      MEDICAL: 'medical',
      GENERAL: 'document',
    };
    return iconMap[classification] || 'document';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFileColor = (type) => {
    const colorMap = {
      pdf: ['#667eea', '#764ba2'],
      doc: ['#4facfe', '#00f2fe'],
      docx: ['#4facfe', '#00f2fe'],
      ppt: ['#f093fb', '#f5576c'],
      pptx: ['#f093fb', '#f5576c'],
      xls: ['#43e97b', '#38f9d7'],
      xlsx: ['#43e97b', '#38f9d7'],
      image: ['#667eea', '#764ba2'],
      txt: ['#fa709a', '#fee140'],
    };
    return colorMap[type] || ['#667eea', '#764ba2'];
  };

  const renderGridItem = ({ item }) => (
    <Animated.View style={[styles.gridItem, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={[styles.gridCard, item.isLocal && styles.localDocumentCard]}
        onPress={() => navigation.navigate('ViewDocument', { document: item })}
        onLongPress={() => deleteDocument(item.id)}
      >
        {/* Storage Status Badge */}
        <View style={styles.storageBadge}>
          <Ionicons 
            name={item.isLocal ? 'phone-portrait' : 'cloud'} 
            size={12} 
            color={item.isLocal ? '#ff6b6b' : '#51cf66'} 
          />
          <Text style={[styles.storageBadgeText, { color: item.isLocal ? '#ff6b6b' : '#51cf66' }]}>
            {item.isLocal ? 'Local' : 'Cloud'}
          </Text>
        </View>
        
        {/* Document Type Icon */}
        <LinearGradient
          colors={getDocumentColor(item.classification)}
          style={styles.gridIconContainer}
        >
          <Ionicons name={getDocumentIcon(item.classification)} size={32} color="#fff" />
        </LinearGradient>
        
        {/* Document Title */}
        <Text style={styles.gridFileName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.gridFileInfo}>{formatDate(item.created_at)}</Text>
        
        {/* Classification Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: getDocumentColor(item.classification)[0] + '20' }]}>
          <Text style={[styles.categoryText, { color: getDocumentColor(item.classification)[0] }]}>
            {item.classification}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderListItem = ({ item }) => (
    <Animated.View style={[styles.listItem, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={[styles.listCard, item.isUserDocument && styles.userDocumentListCard]}
        onPress={() => navigation.navigate('ViewDocument', { document: item })}
      >
        <LinearGradient
          colors={getFileColor(item.type)}
          style={styles.listIconContainer}
        >
          <Ionicons name={getFileIcon(item.type)} size={24} color="#fff" />
        </LinearGradient>
        <View style={styles.listInfo}>
          <View style={styles.listHeader}>
            <Text style={styles.listFileName} numberOfLines={1}>{item.name}</Text>
            {item.isUserDocument && (
              <View style={styles.userBadgeSmall}>
                <Text style={styles.userBadgeSmallText}>MY DOC</Text>
              </View>
            )}
          </View>
          <Text style={styles.listFileInfo}>{item.type.toUpperCase()} • {item.size} • {item.date}</Text>
          {item.category && (
            <Text style={[styles.listCategory, { color: getFileColor(item.type)[0] }]}>{item.category}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.listAction}
          onPress={() => deleteDocument(item.id)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

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
          <Text style={styles.headerTitle}>My Documents</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewModeButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Ionicons
                name={viewMode === 'grid' ? 'list' : 'grid'}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{documents.length}</Text>
            <Text style={styles.statLabel}>Documents</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {(documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0) / 1024).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>GB Used</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : (
        <FlatList
          data={documents}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={[
            styles.listContent,
            viewMode === 'list' && styles.listContentList,
          ]}
          key={viewMode}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="folder-open" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>
                Scan or upload documents to get started
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ScanDocument')}
      >
        <LinearGradient
          colors={['#f093fb', '#f5576c']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
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
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  viewModeButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  listContentList: {
    padding: 20,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
  },
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gridIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  gridFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  gridFileInfo: {
    fontSize: 12,
    color: '#999',
  },
  listItem: {
    marginBottom: 12,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  listIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginLeft: 15,
  },
  listFileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listFileInfo: {
    fontSize: 13,
    color: '#999',
  },
  listAction: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDocumentCard: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  userDocumentListCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  userBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  userBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userBadgeSmall: {
    backgroundColor: '#667eea',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  userBadgeSmallText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  // Storage Badge Styles
  storageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  storageBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  localDocumentCard: {
    borderColor: '#ff6b6b',
    borderWidth: 1,
  },
});

export default DocumentListScreen;
