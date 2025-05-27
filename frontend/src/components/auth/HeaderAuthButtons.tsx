// frontend/src/components/auth/HeaderAuthButtons.tsx
import React from 'react';
import { useClerkAuth } from '../../hooks/useClerk';

const HeaderAuthButtons: React.FC = () => {
  const { handleSignIn, handleSignUp } = useClerkAuth();

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleSignIn}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Sign In
      </button>
      <button
        onClick={handleSignUp}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
};

export default HeaderAuthButtons;