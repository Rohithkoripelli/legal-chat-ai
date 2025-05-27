import React from 'react';
import { FileText, Trash2, Download } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  type: string;
}

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, onDownload }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <FileText className="h-8 w-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">{document.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(document.size)} • {document.type}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Uploaded {document.uploadedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDownload(document.id)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Download"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;