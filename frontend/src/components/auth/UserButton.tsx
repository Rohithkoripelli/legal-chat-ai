// frontend/src/components/auth/UserButton.tsx
import React, { useState } from 'react';
import { useClerkAuth } from '../../hooks/useClerk';

const UserButton: React.FC = () => {
  const { user, handleSignOut } = useClerkAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors min-w-0"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || 'User'}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="hidden sm:block min-w-0">
          <span className="text-sm font-medium text-gray-700 truncate block max-w-[120px]">
            {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
          </span>
        </div>
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-gray-500 truncate">{user.emailAddresses[0]?.emailAddress}</div>
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserButton;