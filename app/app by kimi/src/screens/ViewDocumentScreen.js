import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const ViewDocumentScreen = ({ route, navigation }) => {
  const { document } = route.params || {};
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!document) {
      Alert.alert('Error', 'No document data provided');
      navigation.goBack();
      return;
    }

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
  }, [document]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this document: ${document.name}`,
        title: document.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share document');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download',
      `Download ${document.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            Alert.alert('Success', 'Document downloaded successfully!');
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete ${document.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Document has been deleted');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const zoomIn = () => {
    if (scale < 3) setScale(scale + 0.5);
  };

  const zoomOut = () => {
    if (scale > 0.5) setScale(scale - 0.5);
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

  const getFileColor = (type) => {
    const colorMap = {
      pdf: ['#ff6b6b', '#ee5a5a'],
      doc: ['#4ecdc4', '#44a08d'],
      docx: ['#4ecdc4', '#44a08d'],
      ppt: ['#f093fb', '#f5576c'],
      pptx: ['#f093fb', '#f5576c'],
      xls: ['#43e97b', '#38f9d7'],
      xlsx: ['#43e97b', '#38f9d7'],
      image: ['#667eea', '#764ba2'],
      txt: ['#fa709a', '#fee140'],
    };
    return colorMap[type] || ['#667eea', '#764ba2'];
  };

  // Sample document content for demo
  const documentContent = document?.isUserDocument 
    ? `Document Content Preview

This is your personal document uploaded to the system.

Document Details:
• File Name: ${document?.name || 'Unknown'}
• File Type: ${document?.type?.toUpperCase() || 'Unknown'}
• File Size: ${document?.size || 'Unknown'}
• Upload Date: ${document?.date || 'Unknown'}
• Category: ${document?.category || 'General'}
${document?.filePath ? `• File Path: ${document.filePath}` : ''}

${document?.description || ''}

This document is stored securely in your personal document library.`
    : `Document Content Preview

This is a preview of the document content. In a real implementation, this would display the actual content of the uploaded file.

Document Details:
• File Name: ${document?.name || 'Unknown'}
• File Type: ${document?.type?.toUpperCase() || 'Unknown'}
• File Size: ${document?.size || 'Unknown'}
• Upload Date: ${document?.date || 'Unknown'}

Features Available:
1. View document in fullscreen mode
2. Zoom in/out for better readability
3. Share document with others
4. Download to local storage
5. Delete when no longer needed

This document viewer supports multiple file formats including PDF, DOC, DOCX, images, and text files. The Legal AI Document Suite provides a comprehensive solution for managing all your documents in one place.

Powered by Legal AI Technology.`;

  return (
    <View style={styles.container}>
      {!isFullscreen && (
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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {document?.name || 'Document'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {document?.type?.toUpperCase()} • {document?.size}
              </Text>
            </View>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

      <Animated.View
        style={[
          styles.content,
          isFullscreen && styles.fullscreenContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Document Preview Area */}
        <View style={styles.previewContainer}>
          <ScrollView
            style={styles.previewScroll}
            contentContainerStyle={[
              styles.previewContent,
              { transform: [{ scale }] },
            ]}
            showsVerticalScrollIndicator={true}
            pinchGestureEnabled={true}
          >
            {document?.type === 'image' ? (
              <View style={styles.imagePlaceholder}>
                <LinearGradient
                  colors={getFileColor(document?.type)}
                  style={styles.imageGradient}
                >
                  <Ionicons name="image" size={100} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.imagePlaceholderText}>Image Preview</Text>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.documentView}>
                <LinearGradient
                  colors={['#fff', '#f8f9ff']}
                  style={styles.documentPage}
                >
                  <View style={styles.documentHeader}>
                    <LinearGradient
                      colors={getFileColor(document?.type)}
                      style={styles.documentIcon}
                    >
                      <Ionicons
                        name={getFileIcon(document?.type)}
                        size={40}
                        color="#fff"
                      />
                    </LinearGradient>
          <View style={styles.documentInfo}>
                      <View style={styles.documentTitleRow}>
                        <Text style={styles.documentName}>
                          {document?.name || 'Document'}
                        </Text>
                        {document?.isUserDocument && (
                          <View style={styles.userBadge}>
                            <Text style={styles.userBadgeText}>MY DOC</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.documentMeta}>
                        {document?.type?.toUpperCase()} Document
                      </Text>
                      {document?.category && (
                        <Text style={styles.categoryText}>Category: {document.category}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.documentBody}>
                    <Text style={styles.documentText}>{documentContent}</Text>
                  </View>
                  <View style={styles.documentFooter}>
                    <Text style={styles.pageNumber}>Page 1 of 1</Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </ScrollView>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Ionicons name="remove" size={20} color="#667eea" />
            </TouchableOpacity>
            <Text style={styles.zoomText}>{Math.round(scale * 100)}%</Text>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Ionicons name="add" size={20} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={() => setIsFullscreen(!isFullscreen)}
            >
              <Ionicons
                name={isFullscreen ? 'contract' : 'expand'}
                size={20}
                color="#667eea"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        {!isFullscreen && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={styles.actionGradient}
              >
                <Ionicons name="download" size={20} color="#fff" />
                <Text style={styles.actionText}>Download</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionGradient}
              >
                <Ionicons name="share" size={20} color="#fff" />
                <Text style={styles.actionText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a5a']}
                style={styles.actionGradient}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.actionText}>Delete</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
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
  },
  backButton: {
    padding: 10,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  shareButton: {
    padding: 10,
  },
  content: {
    flex: 1,
  },
  fullscreenContent: {
    paddingTop: 40,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#e8eaf6',
    position: 'relative',
  },
  previewScroll: {
    flex: 1,
  },
  previewContent: {
    padding: 20,
    minHeight: height - 200,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: width - 40,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginTop: 20,
  },
  documentView: {
    width: width - 40,
    minHeight: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  documentPage: {
    flex: 1,
    borderRadius: 10,
    padding: 30,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 20,
    marginBottom: 20,
  },
  documentIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  documentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginRight: 10,
  },
  documentMeta: {
    fontSize: 14,
    color: '#666',
  },
  userBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 13,
    color: '#667eea',
    marginTop: 4,
    fontWeight: '600',
  },
  documentBody: {
    flex: 1,
  },
  documentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  documentFooter: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 14,
    color: '#999',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  zoomText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    minWidth: 50,
    textAlign: 'center',
  },
  fullscreenButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginLeft: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ViewDocumentScreen;
