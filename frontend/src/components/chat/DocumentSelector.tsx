import React, { useState } from 'react';
import { FileText, Plus, Minus, Check } from 'lucide-react';

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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  documents,
  selectedDocumentIds,
  onSelectionChange,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsed);

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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  if (documents.length === 0) {
    return null;
  }

  const allSelected = selectedDocumentIds.length === documents.length;
  const someSelected = selectedDocumentIds.length > 0 && selectedDocumentIds.length < documents.length;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            Select Documents for Chat
          </span>
          <span className="text-xs text-gray-500">
            ({selectedDocumentIds.length} of {documents.length} selected)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Select All/None Button */}
          <button
            onClick={handleSelectAll}
            className={`text-xs px-2 py-1 rounded ${
              allSelected 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : someSelected
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
          </button>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-gray-700 p-1"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Document List */}
      {isExpanded && (
        <div className="space-y-2">
          {documents.map((doc, index) => {
            const isSelected = selectedDocumentIds.includes(doc.id);
            const displayName = doc.title || doc.name || `Document ${index + 1}`;
            
            return (
              <div
                key={doc.id || index}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleDocumentToggle(doc.id)}
              >
                {/* Checkbox */}
                <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
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
                
                {/* Document Name */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm truncate block ${
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
                  <div className="flex-shrink-0 text-blue-600">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary when collapsed */}
      {!isExpanded && selectedDocumentIds.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedDocumentIds.slice(0, 3).map(docId => {
            const doc = documents.find(d => d.id === docId);
            if (!doc) return null;
            
            const displayName = doc.title || doc.name || 'Document';
            return (
              <div
                key={docId}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                <FileText className="h-3 w-3" />
                <span className="max-w-20 truncate">{displayName}</span>
              </div>
            );
          })}
          {selectedDocumentIds.length > 3 && (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              +{selectedDocumentIds.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* No documents selected message */}
      {isExpanded && selectedDocumentIds.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            No documents selected. Your chat will work without document context.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Select documents above to include them in your conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentSelector;