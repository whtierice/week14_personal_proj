import apiClient from './client';
import { ApiResponse, MagicLinkRequestDto, AuthResponse } from './types';

// 인증 관련 API 함수
export const authApi = {
  // 매직 링크 요청
  requestMagicLink: async (data: MagicLinkRequestDto): Promise<{ success: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/auth/magic-link', data);
    return response.data.data;
  },
  
  // 매직 링크 토큰 검증
  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.get<ApiResponse<AuthResponse>>(`/auth/verify?token=${token}`);
    return response.data.data;
  },
  
  // 토큰 갱신
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data.data;
  },
  
  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  }
};