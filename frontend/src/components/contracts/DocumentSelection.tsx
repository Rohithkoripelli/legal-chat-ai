import React from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { FileText, BarChart3 } from 'lucide-react';
import OCRBadge from '../common/OCRBadge';

interface DocumentSelectionProps {
  onSelectDocument: (documentId: string) => void;
}

const DocumentSelectionForAnalysis: React.FC<DocumentSelectionProps> = ({ onSelectDocument }) => {
  const { documents, loading, error } = useDocuments();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contract Risk Analysis</h1>
        <p className="text-gray-600">Select a document to analyze for legal risks and key terms</p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
          <p className="text-gray-600">Upload documents first to analyze them for risks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <div
              key={document.id}
              onClick={() => onSelectDocument(document.id)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {document.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                    <OCRBadge 
                      ocrProcessed={document.ocrProcessed}
                      ocrProvider={document.ocrProvider}
                      ocrConfidence={document.ocrConfidence}
                      isScannedDocument={document.isScannedDocument}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {(document.size / 1024).toFixed(1)} KB
                </span>
                <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Analyze</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentSelectionForAnalysis;