import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { Conversation } from '../../types';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: (title?: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isLoading?: boolean;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isLoading = false
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);


  const truncateTitle = (title: string, maxLength: number = 35) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(conversationId);
    }
    setActiveMenu(null);
  };

  const toggleMenu = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === conversationId ? null : conversationId);
  };

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full shadow-lg lg:shadow-none">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={() => onCreateConversation()}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
            title="New conversation"
          >
            <Plus size={20} />
          </button>
        </div>
        {/* New Conversation Button - Prominent */}
        <button
          onClick={() => onCreateConversation()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Conversation
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`relative group p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                  currentConversation?._id === conversation._id
                    ? 'bg-blue-100 border border-blue-200'
                    : 'hover:bg-white hover:shadow-sm'
                }`}
                onClick={() => onSelectConversation(conversation._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">
                      {truncateTitle(conversation.title)}
                    </h3>
                  </div>
                  
                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => toggleMenu(e, conversation._id)}
                      className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeMenu === conversation._id && (
                      <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                        <button
                          onClick={(e) => handleDeleteClick(e, conversation._id)}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;