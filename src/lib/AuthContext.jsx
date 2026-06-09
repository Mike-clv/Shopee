import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { localClient } from '@/api/localClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState({
    id: 'local',
    public_settings: {
      name: 'Mã Giảm Giá Pro',
      auth_required: false,
    },
  });

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const currentUser = await localClient.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkAppState = useCallback(async () => {
    await checkUserAuth();
  }, [checkUserAuth]);

  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  const logout = useCallback(async (redirectTo = '/') => {
    await localClient.auth.logout().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);

    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, []);

  const navigateToLogin = useCallback(() => {
    const redirect = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
