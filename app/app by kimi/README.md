# AI Document Suite - React Native App

A comprehensive mobile application for Android built with React Native and Expo SDK 55. This app provides AI-powered document management features including scanning, translation, chat assistance, and document reading.

## Features

- **Welcome Page**: Modern animated welcome screen with gradient design
- **Login Page**: Secure authentication with biometric support and default credentials
- **Dashboard**: Interactive dashboard with statistics and quick action cards
- **Scan Document**: Camera-based document scanning with OCR capabilities
- **Translate**: AI-powered translation to 12+ languages using Grok API
- **Chat with AI**: Conversational AI assistant powered by Grok
- **Document Reader**: Upload and analyze documents with AI insights
- **Document List**: Grid/List view of all saved documents
- **View Document**: Full document viewer with zoom and sharing options

## Default Credentials

- **Email**: harshadip@gmail.com
- **Password**: nnnnnnnn

## API Configuration

The app uses Grok AI API with the following configuration:
- API Key: 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
- Model: llama-3.3-70b-versatile

## Installation & Setup

### Prerequisites

1. Install Node.js (v18 or higher)
2. Install Expo CLI: `npm install -g expo-cli`
3. Install Android Studio (for Android emulator)
4. Download Expo Go app on your Android device

### Steps to Run

1. **Navigate to project directory**:
   ```bash
   cd "app by kimi"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on Android**:
   - Press `a` to run on Android emulator
   - Or scan the QR code with Expo Go app on your physical device

### Alternative: Using Expo Go

1. Make sure your Android device and computer are on the same WiFi network
2. Open Expo Go app on your Android device
3. Run `npx expo start` in the project directory
4. Scan the QR code displayed in the terminal or browser

## Project Structure

```
app by kimi/
├── src/
│   ├── App.js                 # Main app entry with navigation
│   ├── screens/
│   │   ├── WelcomeScreen.js       # Animated welcome page
│   │   ├── LoginScreen.js         # Login with modern UI
│   │   ├── DashboardScreen.js     # Main dashboard
│   │   ├── ScanDocumentScreen.js  # Camera document scanner
│   │   ├── TranslateScreen.js     # Translation feature
│   │   ├── ChatWithAIScreen.js    # AI chat interface
│   │   ├── DocumentReaderScreen.js # Document upload & analysis
│   │   ├── DocumentListScreen.js   # Document grid/list view
│   │   └── ViewDocumentScreen.js   # Document viewer
│   └── services/
│       └── GrokService.js         # Grok AI API integration
├── assets/                    # App icons and images
├── app.config.ts             # Expo configuration
├── package.json              # Dependencies
└── babel.config.js           # Babel configuration
```

## Key Dependencies

- expo ~55.0.0
- @react-navigation/native ^7.0.0
- expo-camera ~16.1.0
- expo-document-picker ~13.1.0
- expo-image-picker ~16.1.0
- @react-native-async-storage/async-storage ^2.1.0
- axios ^1.6.0

## Features Detail

### Document Scanning
- Real-time camera preview with document frame overlay
- Photo capture and gallery selection
- OCR text extraction processing
- Save scanned documents locally

### AI Translation
- 12+ language support
- Quick language switching
- Translation history
- Copy and share translations

### AI Chat Assistant
- Conversational interface with Grok AI
- Quick action prompts
- Message history
- Typing indicators

### Document Analysis
- Upload documents (PDF, DOC, TXT)
- AI-powered content analysis
- Document statistics (word count, sentences, etc.)
- Save analysis results

## Troubleshooting

### Camera not working
- Grant camera permissions in Android settings
- For emulator: use "pick from gallery" option instead

### API errors
- Check internet connection
- Verify API key in GrokService.js
- Fallback responses are provided for demo purposes

### Metro bundler issues
```bash
npx expo start --clear
```

### Clean install
```bash
rm -rf node_modules
npm install
npx expo start
```

## Development Notes

- Uses Expo SDK 55 (latest stable version)
- React Native 0.79.0
- React 18.3.1
- Navigation: React Navigation v7
- State management: React hooks + AsyncStorage

## License

This project is for educational and demonstration purposes.

## Support

For issues and questions, please check the Expo documentation at https://docs.expo.dev
