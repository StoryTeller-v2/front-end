import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getAccessToken, getRefreshToken, getUser, removeTokens } from '../utils/storage';
import { decode as atob } from 'base-64';
import Config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = async (navigation) => {
    try {
      const refreshToken = await getRefreshToken();
      const user = await getUser();

      const response = await fetch(`${Config.API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'refresh': refreshToken
        },
        body: JSON.stringify({
          username: user
        })
      });

      const result = await response.json();

      if (response.ok) {
        await removeTokens();
        setIsLoggedIn(false);
        setProfileId(null);
        Alert.alert('로그아웃', '로그아웃되었습니다.');
        navigation.replace('Login');
      } else {
        console.error('로그아웃 실패:', result);
        Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
      await removeTokens();
      setIsLoggedIn(false);
      setProfileId(null);
      Alert.alert('오류', '로그아웃 처리 중 문제가 발생했지만, 로컬 데이터는 삭제되었습니다.');
      navigation.replace('Login');
    }
  };

  const confirmLogout = (navigation) => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '로그아웃',
          onPress: () => handleLogout(navigation),
          style: 'destructive'
        }
      ],
      { cancelable: true }
    );
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
        confirmLogout,
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
