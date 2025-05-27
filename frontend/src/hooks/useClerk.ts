// frontend/src/hooks/useClerk.ts
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { useCallback } from 'react';

export const useClerkAuth = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();
  const { openSignIn, openSignUp } = useClerk();

  const getUserToken = useCallback(async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }, [getToken]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  const handleSignIn = useCallback(() => {
    openSignIn();
  }, [openSignIn]);

  const handleSignUp = useCallback(() => {
    openSignUp();
  }, [openSignUp]);

  return {
    user,
    isLoaded: userLoaded,
    isSignedIn,
    getUserToken,
    handleSignOut,
    handleSignIn,
    handleSignUp,
  };
};