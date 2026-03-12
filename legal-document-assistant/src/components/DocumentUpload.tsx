import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2, Shield, Lock } from 'lucide-react';
import { LegalDocument } from '../types';

interface DocumentUploadProps {
  onUpload?: (document: LegalDocument) => void;
  onAnalyze?: (document: LegalDocument) => void;
  isProcessing?: boolean;
  uploadedDocument?: LegalDocument | null;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  onAnalyze,
  isProcessing = false,
  uploadedDocument,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const doc: LegalDocument = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type || 'application/pdf',
            size: file.size,
            uploadDate: new Date(),
            content: '',
            status: 'uploaded',
          };
          onUpload?.(doc);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        simulateUpload(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        simulateUpload(file);
      }
    }
  }, []);

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = () => {
    if (uploadedDocument) {
      onAnalyze?.(uploadedDocument);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Upload Your Legal Document</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          We accept PDF, Word documents, and text files. Your document will be encrypted and automatically deleted after analysis.
        </p>
      </div>

      {/* Security Banner */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">256-bit SSL Encryption</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
          <Lock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Auto-Delete After Analysis</span>
        </div>
      </div>

      {/* Upload Area */}
      {!selectedFile && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
            <Upload className={`w-10 h-10 text-primary-600 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {isDragActive ? 'Drop your document here' : 'Drag & drop your document'}
          </h3>
          <p className="text-slate-500 mb-4">or click to browse from your computer</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
            <span className="px-3 py-1 bg-slate-100 rounded-full">PDF</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full">DOC</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full">DOCX</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full">TXT</span>
          </div>
          <p className="mt-4 text-xs text-slate-400">Maximum file size: 25MB</p>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <File className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-slate-900 truncate">{selectedFile.name}</h4>
              <p className="text-sm text-slate-500 mt-1">{formatFileSize(selectedFile.size)}</p>

              {/* Progress Bar */}
              {uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Uploading...</span>
                    <span className="text-slate-900 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadProgress === 100 && !isProcessing && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Upload complete! Ready to analyze.</span>
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 flex items-center gap-2 text-primary-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">AI is analyzing your document...</span>
                </div>
              )}
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Action Buttons */}
          {uploadProgress === 100 && !isProcessing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAnalyze}
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Analyze Document
              </button>
              <button
                onClick={handleRemoveFile}
                className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Privacy Note */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-slate-900">Privacy Guarantee</h4>
            <p className="text-sm text-slate-600 mt-1">
              Your document is encrypted during upload and analysis. We automatically delete all documents 
              within 24 hours. We never share, sell, or use your documents for any purpose other than providing 
              you with analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Sample Documents */}
      {!selectedFile && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Or try with a sample document:</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Employment Contract', 'Lease Agreement', 'NDA Template'].map((doc, index) => (
              <button
                key={index}
                onClick={() => {
                  // Simulate loading a sample document
                  const sampleFile = new File(['sample'], `${doc.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
                  setSelectedFile(sampleFile);
                  simulateUpload(sampleFile);
                }}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-soft transition-all text-left"
              >
                <File className="w-8 h-8 text-primary-500 mb-2" />
                <div className="font-medium text-slate-900">{doc}</div>
                <div className="text-xs text-slate-500 mt-1">Sample PDF</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
