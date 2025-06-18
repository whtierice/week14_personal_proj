import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routineApi } from '../api';
import { Routine } from '../types';
import { CreateRoutineDto, UpdateRoutineDto } from '../api/types';

// 루틴 목록 조회 훅
export const useRoutines = () => {
  return useQuery<Routine[], Error>({
    queryKey: ['routines'],
    queryFn: routineApi.getAll,
  });
};

// 특정 루틴 조회 훅
export const useRoutine = (id: string) => {
  return useQuery<Routine, Error>({
    queryKey: ['routines', id],
    queryFn: () => routineApi.getById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// 루틴 생성 훅
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Routine, Error, CreateRoutineDto>({
    mutationFn: (data) => routineApi.create(data),
    onSuccess: () => {
      // 성공 시 루틴 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
};

// 루틴 업데이트 훅
export const useUpdateRoutine = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Routine, Error, UpdateRoutineDto>({
    mutationFn: (data) => routineApi.update(id, data),
    onSuccess: (updatedRoutine) => {
      // 성공 시 해당 루틴 및 루틴 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['routines', id] });
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      
      // 캐시 직접 업데이트 (선택적)
      queryClient.setQueryData(['routines', id], updatedRoutine);
    },
  });
};

// 루틴 삭제 훅
export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => routineApi.delete(id),
    onSuccess: (_, id) => {
      // 성공 시 루틴 목록 갱신 및 캐시에서 삭제
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.removeQueries({ queryKey: ['routines', id] });
    },
  });
};