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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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

  // Calculate dropdown position with mobile handling
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768; // md breakpoint
      
      // Calculate if dropdown would go off-screen
      const dropdownHeight = 256; // max-height in pixels
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldDropUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
      
      let style: React.CSSProperties;
      
      if (isMobile) {
        // Mobile: Use safer positioning with better constraints
        style = {
          position: 'fixed',
          top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
          left: Math.max(16, Math.min(rect.left, viewportWidth - rect.width - 16)), // 16px margin
          width: Math.min(rect.width, viewportWidth - 32), // Ensure it fits with margins
          zIndex: 2147483647,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxHeight: Math.min(dropdownHeight, viewportHeight - 100), // Leave space for margins
          overflow: 'hidden'
        };
      } else {
        // Desktop: Use standard positioning
        style = {
          position: 'fixed',
          top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 2147483647,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxHeight: dropdownHeight,
          overflow: 'hidden'
        };
      }
      
      setDropdownStyle(style);
    }
  }, [isOpen]);

  // Handle scroll and resize events to reposition dropdown
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth < 768;
        
        const dropdownHeight = 256;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const shouldDropUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
        
        let style: React.CSSProperties;
        
        if (isMobile) {
          style = {
            position: 'fixed',
            top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
            left: Math.max(16, Math.min(rect.left, viewportWidth - rect.width - 16)),
            width: Math.min(rect.width, viewportWidth - 32),
            zIndex: 2147483647,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: Math.min(dropdownHeight, viewportHeight - 100),
            overflow: 'hidden'
          };
        } else {
          style = {
            position: 'fixed',
            top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 2147483647,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: dropdownHeight,
            overflow: 'hidden'
          };
        }
        
        setDropdownStyle(style);
      }
    };

    // Add event listeners for scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleDocumentToggle = (documentId: string) => {
    const isCurrentlySelected = selectedDocumentIds.includes(documentId);
    let newSelection: string[];
    
    if (isCurrentlySelected) {
      newSelection = selectedDocumentIds.filter(id => id !== documentId);
    } else {
      newSelection = [...selectedDocumentIds, documentId];
    }
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedDocumentIds.length === documents.length) {
      onSelectionChange([]);
    } else {
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
    <>
      <div className="mb-3">
        {/* Dropdown Trigger */}
        <button
          ref={buttonRef}
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

      {/* Mobile backdrop */}
      {isOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
          style={{ zIndex: 2147483646 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu - Rendered at root level with fixed positioning */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
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
                  className={`flex items-center space-x-3 p-3 md:p-3 sm:p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors touch-manipulation ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleDocumentToggle(doc.id)}
                  style={{ minHeight: '48px' }} // Ensure touch-friendly height
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
    </>
  );
};

export default DocumentSelector;