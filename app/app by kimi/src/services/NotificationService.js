// Notification Service
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  static async requestPermissions() {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleNotification(title, body, data = {}, trigger = null) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return false;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // Show immediately if no trigger
      });
      return notificationId;
    } catch (error) {
      console.log('Error scheduling notification:', error);
      return false;
    }
  }

  static async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.log('Error canceling notification:', error);
      return false;
    }
  }

  static async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Document processing notifications
  static async notifyDocumentProcessed(documentType, summary) {
    return this.scheduleNotification(
      'Document Processed Successfully! 📄',
      `Your ${documentType} has been analyzed and is ready to view.`,
      { type: 'document_processed', documentType, summary }
    );
  }

  static async notifyDocumentSaved(location) {
    return this.scheduleNotification(
      'Document Saved! 💾',
      `Your document has been saved to ${location}.`,
      { type: 'document_saved', location }
    );
  }

  static async notifyMLModelStatus(status) {
    const titles = {
      connected: 'ML Model Connected! 🤖',
      disconnected: 'ML Model Disconnected ⚠️',
      error: 'ML Model Error ❌'
    };

    const bodies = {
      connected: 'Your ML model is ready for document analysis.',
      disconnected: 'ML model connection lost. Using fallback mode.',
      error: 'ML model encountered an error. Please check configuration.'
    };

    return this.scheduleNotification(
      titles[status] || 'ML Model Status',
      bodies[status] || 'ML model status updated.',
      { type: 'ml_model_status', status }
    );
  }

  // Welcome notifications
  static async sendWelcomeNotification(userEmail) {
    return this.scheduleNotification(
      'Welcome to AI Document App! 🎉',
      `Hello ${userEmail}! Start scanning documents with AI-powered analysis.`,
      { type: 'welcome', userEmail }
    );
  }

  // Feature notifications
  static async notifyFeatureEnabled(feature) {
    const features = {
      darkMode: 'Dark Mode Enabled 🌙',
      notifications: 'Notifications Enabled 🔔',
      mlModel: 'ML Model Connected 🤖'
    };

    return this.scheduleNotification(
      features[feature] || 'Feature Enabled',
      `${feature} has been enabled successfully.`,
      { type: 'feature_enabled', feature }
    );
  }
}

export default NotificationService;
