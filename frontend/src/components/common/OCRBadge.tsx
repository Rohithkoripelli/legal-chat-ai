import React from 'react';
import { Eye, Scan, AlertCircle, CheckCircle } from 'lucide-react';

interface OCRBadgeProps {
  ocrProcessed?: boolean;
  ocrProvider?: string;
  ocrConfidence?: number;
  isScannedDocument?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const OCRBadge: React.FC<OCRBadgeProps> = ({
  ocrProcessed = false,
  ocrProvider,
  ocrConfidence,
  isScannedDocument = false,
  size = 'md',
  showDetails = false
}) => {
  // Don't show badge if no OCR processing occurred
  if (!ocrProcessed && !isScannedDocument) {
    return null;
  }

  const getProviderDisplayName = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case 'google': return 'Google Vision';
      case 'aws': return 'AWS Textract';
      case 'tesseract': return 'Tesseract';
      default: return 'OCR';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-700';
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-sm';
      default: return 'text-xs';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return 'px-1.5 py-0.5';
      case 'lg': return 'px-3 py-1.5';
      default: return 'px-2 py-1';
    }
  };

  // Simple badge for non-OCR processed documents that are scanned
  if (!ocrProcessed && isScannedDocument) {
    return (
      <span className={`inline-flex items-center space-x-1 rounded-full bg-blue-100 text-blue-800 ${getPadding()} ${getTextSize()} font-medium`}>
        <Eye className={getIconSize()} />
        <span>Scanned</span>
      </span>
    );
  }

  // OCR processed badge
  return (
    <div className="flex items-center space-x-1">
      <span className={`inline-flex items-center space-x-1 rounded-full bg-purple-100 text-purple-800 ${getPadding()} ${getTextSize()} font-medium`}>
        <Scan className={getIconSize()} />
        <span>OCR</span>
        {showDetails && ocrProvider && (
          <span className="hidden sm:inline">
            • {getProviderDisplayName(ocrProvider)}
          </span>
        )}
      </span>
      
      {showDetails && ocrConfidence && (
        <span className={`inline-flex items-center space-x-1 rounded-full ${getConfidenceColor(ocrConfidence)} ${getPadding()} ${getTextSize()} font-medium`}>
          {ocrConfidence >= 90 ? (
            <CheckCircle className={getIconSize()} />
          ) : (
            <AlertCircle className={getIconSize()} />
          )}
          <span>{ocrConfidence}%</span>
        </span>
      )}
    </div>
  );
};

export default OCRBadge;