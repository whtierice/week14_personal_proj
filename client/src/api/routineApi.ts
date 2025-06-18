import apiClient from './client';
import { Routine } from '../types';
import { ApiResponse, CreateRoutineDto, UpdateRoutineDto, PaginatedResponse } from './types';

// 루틴 관련 API 함수
export const routineApi = {
  // 모든 루틴 가져오기
  getAll: async (): Promise<Routine[]> => {
    const response = await apiClient.get<ApiResponse<Routine[]>>('/routines');
    return response.data.data;
  },
  
  // 특정 루틴 가져오기
  getById: async (id: string): Promise<Routine> => {
    const response = await apiClient.get<ApiResponse<Routine>>(`/routines/${id}`);
    return response.data.data;
  },
  
  // 새 루틴 생성하기
  create: async (data: CreateRoutineDto): Promise<Routine> => {
    const response = await apiClient.post<ApiResponse<Routine>>('/routines', data);
    return response.data.data;
  },
  
  // 루틴 업데이트하기
  update: async (id: string, data: UpdateRoutineDto): Promise<Routine> => {
    const response = await apiClient.put<ApiResponse<Routine>>(`/routines/${id}`, data);
    return response.data.data;
  },
  
  // 루틴 삭제하기
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/routines/${id}`);
  }
};