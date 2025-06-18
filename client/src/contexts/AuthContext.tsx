import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { AuthResponse } from '../api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  login: (token: string, expiresAt: string, user: AuthResponse['user'], rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // 토큰 유효성 검사 또는 갱신
        const authData = await authApi.refreshToken();
        
        // 사용자 정보 설정
        setUser(authData.user);
        setIsAuthenticated(true);
        
        // 토큰 저장 (기존 저장소에 따라)
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('token', authData.token);
      } catch (error) {
        // 토큰이 유효하지 않으면 로그아웃
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // 로그인 함수
  const login = (token: string, expiresAt: string, userData: AuthResponse['user'], rememberMe: boolean) => {
    // 토큰 저장 (rememberMe에 따라 저장소 선택)
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    
    // 사용자 정보 설정
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      // 로컬 상태 초기화
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 토큰 만료 체크 (주기적으로)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkTokenExpiry = async () => {
      try {
        await authApi.refreshToken();
      } catch (error) {
        // 토큰 갱신 실패 시 로그아웃
        logout();
      }
    };
    
    // 30분마다 토큰 갱신 체크
    const interval = setInterval(checkTokenExpiry, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};