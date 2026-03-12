// ML Model Configuration
// Update these values with your actual ML model details

export const ML_CONFIG = {
  // Local ML Model Server using your IP address
  MODEL_URL: 'http://192.168.137.64:5000',  // Your computer's IP
  
  // API Key for local server
  API_KEY: 'ml-model-api-key-123',
  
  // Model Name
  MODEL_NAME: 'document-analyzer',
  
  // Model Endpoints
  ENDPOINTS: {
    ANALYZE: '/analyze',           // Full document analysis
    OCR: '/ocr',                   // Text extraction only
    CLASSIFY: '/classify',         // Document classification
    SUMMARIZE: '/summarize',       // Text summarization
    HEALTH: '/health'              // Health check
  },
  
  // Request Configuration
  REQUEST_CONFIG: {
    timeout: 30000,                // 30 seconds timeout
    maxRetries: 3,                 // Maximum retry attempts
    retryDelay: 1000,              // Delay between retries (ms)
  },
  
  // Model Parameters
  MODEL_PARAMS: {
    temperature: 0.5,              // Analysis temperature
    maxTokens: 2048,               // Maximum tokens for summarization
    language: 'en',                // Default language
    confidence: 0.7                // Minimum confidence threshold
  },
  
  // Supported Document Types
  DOCUMENT_TYPES: [
    'INVOICE',
    'RECEIPT', 
    'CONTRACT',
    'AGREEMENT',
    'IDENTITY',
    'MEDICAL',
    'FINANCIAL',
    'LEGAL',
    'GENERAL'
  ],
  
  // OCR Configuration
  OCR_CONFIG: {
    languages: ['en'],             // Supported languages
    preprocess: true,              // Preprocess image
    enhance: true                  // Enhance image quality
  },
  
  // Classification Labels
  CLASSIFICATION_LABELS: {
    FINANCIAL: ['invoice', 'receipt', 'payment', 'bill', 'amount'],
    LEGAL: ['contract', 'agreement', 'terms', 'conditions', 'signature'],
    MEDICAL: ['prescription', 'diagnosis', 'treatment', 'patient', 'doctor'],
    IDENTITY: ['passport', 'license', 'id', 'identification'],
    GENERAL: []
  }
};

// Helper function to validate ML configuration
export const validateMLConfig = () => {
  const errors = [];
  
  if (!ML_CONFIG.MODEL_URL || ML_CONFIG.MODEL_URL === 'YOUR_ML_MODEL_ENDPOINT') {
    errors.push('MODEL_URL is not configured');
  }
  
  if (!ML_CONFIG.API_KEY || ML_CONFIG.API_KEY === 'YOUR_ML_MODEL_API_KEY') {
    errors.push('API_KEY is not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint) => {
  return `${ML_CONFIG.MODEL_URL}${ML_CONFIG.ENDPOINTS[endpoint]}`;
};

// Helper function to prepare request headers
export const getRequestHeaders = () => {
  return {
    'Authorization': `Bearer ${ML_CONFIG.API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AI-Document-App/1.0'
  };
};

export default ML_CONFIG;
