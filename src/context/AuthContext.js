import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken } from '../utils/storage';
import { decode as atob } from 'base-64';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          if (payload.exp > Date.now() / 1000) {
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 중 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    setIsLoggedIn(false);
    setProfileId(null);
  };

  const selectProfile = id => {
    console.log('selectProfile 호출, 전달된 ID:', id);
    setProfileId(id);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        profileId,
        selectProfile,
        isLoading,
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
