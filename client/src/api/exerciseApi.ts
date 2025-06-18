import apiClient from './client';
import { Exercise } from '../types';
import { ApiResponse, CreateExerciseDto, UpdateExerciseDto } from './types';

// 운동 관련 API 함수
export const exerciseApi = {
  // 특정 루틴의 모든 운동 가져오기
  getByRoutineId: async (routineId: string): Promise<Exercise[]> => {
    const response = await apiClient.get<ApiResponse<Exercise[]>>(`/routines/${routineId}/exercises`);
    return response.data.data;
  },
  
  // 특정 운동 가져오기
  getById: async (id: string): Promise<Exercise> => {
    const response = await apiClient.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return response.data.data;
  },
  
  // 새 운동 생성하기
  create: async (routineId: string, data: CreateExerciseDto): Promise<Exercise> => {
    const response = await apiClient.post<ApiResponse<Exercise>>(`/routines/${routineId}/exercises`, data);
    return response.data.data;
  },
  
  // 운동 업데이트하기
  update: async (id: string, data: UpdateExerciseDto): Promise<Exercise> => {
    const response = await apiClient.put<ApiResponse<Exercise>>(`/exercises/${id}`, data);
    return response.data.data;
  },
  
  // 운동 삭제하기
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/exercises/${id}`);
  }
};