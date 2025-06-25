import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Check, X } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  title?: string;
  size?: number;
  type?: string;
  uploadedAt?: Date;
}

interface DocumentSelectorProps {
  documents: Document[];
  selectedDocumentIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  documents,
  selectedDocumentIds,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDocumentToggle = (documentId: string) => {
    const isCurrentlySelected = selectedDocumentIds.includes(documentId);
    let newSelection: string[];
    
    if (isCurrentlySelected) {
      // Remove from selection
      newSelection = selectedDocumentIds.filter(id => id !== documentId);
    } else {
      // Add to selection
      newSelection = [...selectedDocumentIds, documentId];
    }
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedDocumentIds.length === documents.length) {
      // Deselect all
      onSelectionChange([]);
    } else {
      // Select all
      onSelectionChange(documents.map(doc => doc.id));
    }
  };


  const removeDocument = (documentId: string) => {
    const newSelection = selectedDocumentIds.filter(id => id !== documentId);
    onSelectionChange(newSelection);
  };

  if (documents.length === 0) {
    return null;
  }

  const getDisplayText = () => {
    if (selectedDocumentIds.length === 0) {
      return 'Select documents for chat';
    } else if (selectedDocumentIds.length === 1) {
      const doc = documents.find(d => d.id === selectedDocumentIds[0]);
      return doc?.title || doc?.name || 'Document';
    } else {
      return `${selectedDocumentIds.length} documents selected`;
    }
  };

  const allSelected = selectedDocumentIds.length === documents.length;

  return (
    <div className="mb-3 relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className={`text-sm ${selectedDocumentIds.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
              {getDisplayText()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedDocumentIds.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {selectedDocumentIds.length}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Selected Documents Pills (when closed) */}
        {!isOpen && selectedDocumentIds.length > 0 && selectedDocumentIds.length <= 3 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedDocumentIds.map(docId => {
              const doc = documents.find(d => d.id === docId);
              if (!doc) return null;
              
              const displayName = doc.title || doc.name || 'Document';
              return (
                <div
                  key={docId}
                  className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs group"
                >
                  <FileText className="h-3 w-3" />
                  <span className="max-w-24 truncate">{displayName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(docId);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-blue-200 rounded-full p-0.5 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-hidden"
            style={{ zIndex: 99999 }}
          >
            {/* Header with Select All */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Select Documents ({selectedDocumentIds.length}/{documents.length})
                </span>
                <button
                  onClick={handleSelectAll}
                  className={`text-xs px-2 py-1 rounded ${
                    allSelected 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="max-h-48 overflow-y-auto">
              {documents.map((doc, index) => {
                const isSelected = selectedDocumentIds.includes(doc.id);
                const displayName = doc.title || doc.name || `Document ${index + 1}`;
                
                return (
                  <div
                    key={doc.id || index}
                    className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleDocumentToggle(doc.id)}
                  >
                    {/* Custom Checkbox */}
                    <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    
                    {/* File Icon */}
                    <FileText className={`h-4 w-4 flex-shrink-0 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    
                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm block truncate ${
                        isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                      }`}>
                        {displayName}
                      </span>
                      {doc.type && (
                        <span className="text-xs text-gray-500">
                          {doc.type.split('/').pop()?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer with current selection info */}
            {selectedDocumentIds.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-600">
                  {selectedDocumentIds.length} document{selectedDocumentIds.length !== 1 ? 's' : ''} will be included in your chat
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Help Text */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-400">
          {selectedDocumentIds.length === 0 
            ? 'Click above to select documents for your conversation'
            : `Chat will include ${selectedDocumentIds.length} selected document${selectedDocumentIds.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>
    </div>
  );
};

export default DocumentSelector;